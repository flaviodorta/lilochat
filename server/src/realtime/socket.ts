// src/realtime/socket.ts
import { Server } from 'socket.io';
import type { Server as HttpServer } from 'http';
import sequelize from '../database';
import { QueryTypes } from 'sequelize';

function sanitizeMessage(content: string) {
  return content.trim().slice(0, 2000);
}

type JoinPayload = { roomId: number; userId: number };
type LeavePayload = { roomId: number; userId: number };
type ChatPayload = { roomId: number; userId: number; content: string };

export function setupSocket(server: HttpServer) {
  const io = new Server(server, {
    cors: { origin: '*' },
  });

  /** Helper: sai da sala atual (se houver) e notifica */
  function leaveCurrentRoom(socket: any, reason: string) {
    const prevRoomId = socket.data.roomId as number | undefined;
    const userId = socket.data.userId as number | undefined;
    if (!prevRoomId || !userId) return;

    socket.leave(`room:${prevRoomId}`);
    socket.data.roomId = undefined;

    io.to(`room:${prevRoomId}`).emit('room:user_left', {
      user_id: userId,
      reason,
    });
    // log opcional
    console.log(`⬅️  user ${userId} left room ${prevRoomId} (${reason})`);
  }

  io.on('connection', (socket) => {
    console.log('🔌 client connected:', socket.id);

    // socket.onAny((ev, ...args) => console.log('[onAny]', ev, args)); // debug opcional

    /**
     * JOIN
     * - Se já estava em outra sala, dá leave da anterior
     * - Entra na nova sala e retorna snapshot por ACK (ou push)
     */
    socket.on(
      'room:join',
      async (payload: JoinPayload, ack?: (snap: any) => void) => {
        if (socket.data.roomId === payload.roomId) {
          return ack?.({ ok: true, cached: true }); // evita novo SELECT pesado
        }

        try {
          const { roomId, userId } = payload || ({} as JoinPayload);
          if (!roomId || !userId) {
            const err = { error: true, message: 'roomId/userId inválidos' };
            return typeof ack === 'function'
              ? ack(err)
              : io.to(socket.id).emit('error', err);
          }

          // se estava em outra sala, sai primeiro
          if (socket.data.roomId && socket.data.roomId !== roomId) {
            leaveCurrentRoom(socket, 'switch_room');
          }

          // persiste no socket
          socket.data.roomId = roomId;
          socket.data.userId = userId;

          // entra na sala
          socket.join(`room:${roomId}`);
          console.log('➡️  room:join', { roomId, userId, sid: socket.id });

          // carrega snapshot
          const roomRows = (await sequelize.query(
            `SELECT id, name, king_user_id, current_playlist_item_id
               FROM rooms
              WHERE id = :room_id
              LIMIT 1`,
            { type: QueryTypes.SELECT, replacements: { room_id: roomId } }
          )) as any[];

          const room = roomRows[0];
          if (!room) {
            const err = { error: true, message: 'Room not found' };
            return typeof ack === 'function'
              ? ack(err)
              : io.to(socket.id).emit('error', err);
          }

          const messages = (await sequelize.query(
            `SELECT m.id,
                    m.room_id,
                    m.user_id,
                    m.body AS content,
                    m.created_at,
                    u.nickname AS user_nickname
               FROM messages m
               JOIN users u ON u.id = m.user_id
              WHERE m.room_id = :room_id
              ORDER BY m.created_at ASC
              LIMIT 200`,
            { type: QueryTypes.SELECT, replacements: { room_id: roomId } }
          )) as any[];

          const snapshot = {
            room: {
              id: room.id,
              name: room.name,
              king_user_id: room.king_user_id,
              current_playlist_item_id: room.current_playlist_item_id,
            },
            // Adicione playlist, videos, users, nowPlaying etc. se necessário
            messages,
          };

          // ACK preferencial
          if (typeof ack === 'function') return ack(snapshot);
          // fallback push
          io.to(socket.id).emit('room:snapshot', snapshot);
        } catch (e) {
          const payload = { message: 'failed to join room', detail: String(e) };
          console.error('room:join error', e);
          return typeof ack === 'function'
            ? ack({ error: true, ...payload })
            : io.to(socket.id).emit('error', payload);
        }
      }
    );

    /**
     * LEAVE explícito
     * - Confere se é a mesma sala do socket
     * - Sai e limpa estado
     */
    socket.on('room:leave', (payload: LeavePayload) => {
      try {
        const { roomId, userId } = payload || ({} as LeavePayload);
        // só processa se bater com a sala atual
        if (!roomId || socket.data.roomId !== roomId) return;

        // assegura userId no socket (caso cliente não mande)
        if (!socket.data.userId && userId) socket.data.userId = userId;

        leaveCurrentRoom(socket, 'explicit_leave');
      } catch (e) {
        const err = { message: 'failed to leave room', detail: String(e) };
        console.error('room:leave error', e);
        io.to(socket.id).emit('error', err);
      }
    });

    socket.on('chat:send', async (payload: ChatPayload) => {
      try {
        const { roomId, userId } = payload || ({} as ChatPayload);
        let content = sanitizeMessage(payload?.content ?? '');
        if (!roomId || !userId || !content) return;

        // const now = Date.now();
        // const last = (socket.data._lastMsgAt as number) || 0;
        // if (now - last < 300) return;
        // socket.data._lastMsgAt = now;

        const [insertId] = (await sequelize.query(
          `INSERT INTO messages (room_id, user_id, body, created_at)
           VALUES (:room_id, :user_id, :body, NOW())`,
          {
            type: QueryTypes.INSERT,
            replacements: { room_id: roomId, user_id: userId, body: content },
          }
        )) as any;

        const rows = (await sequelize.query(
          `SELECT m.id,
                  m.room_id,
                  m.user_id,
                  m.body AS content,
                  m.created_at,
                  u.nickname AS user_nickname
             FROM messages m
             JOIN users u ON u.id = m.user_id
            WHERE m.id = :id
            LIMIT 1`,
          { type: QueryTypes.SELECT, replacements: { id: insertId } }
        )) as any[];

        const row = rows[0];
        if (!row) return;

        io.to(`room:${roomId}`).emit('chat:new', row);
      } catch (e) {
        const err = { message: 'failed to send message', detail: String(e) };
        console.error('chat:send error', e);
        io.to(socket.id).emit('error', err);
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 client disconnected:', socket.id, `(${reason})`);
      leaveCurrentRoom(socket, 'disconnect');
    });
  });

  return io;
}
