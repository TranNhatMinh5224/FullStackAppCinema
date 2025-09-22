import React, { useEffect, useState } from 'react';
import { View, Button, Text, StyleSheet, ScrollView } from 'react-native';
import Seat from './Seat';
import wsService from '../service/WebSocketService';

// seats: array of { id, so_ghe, trang_thai } where trang_thai can be 'available'|'dang_giu'|'da_ban' or custom
// scheduleId, userId passed from parent
export default function SeatManager({ seats: initialSeats = [], scheduleId, userId }) {
  const [seats, setSeats] = useState(() => (
    initialSeats.map(s => ({ ...s, state: s.trang_thai || 'available', owner: s.owner || null }))
  ));
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    // connect websocket for schedule
    wsService.connect(scheduleId, userId);

    const handle = (msg) => {
      // msg expected parsed JSON
      const type = msg.type || msg.action || null;
      if (!type) return;

      if (type === 'locked' || msg.type === 'locked') {
        const id = String(msg.seatId || msg.gheId);
        setSeats(prev => prev.map(s => s.id == id ? { ...s, state: 'dang_giu', owner: msg.userId } : s));
        // if someone else locked a seat we should deselect it locally
        setSelected(prev => prev.filter(x => String(x) !== String(id)));
      } else if (type === 'available' || msg.type === 'available') {
        const id = String(msg.seatId || msg.gheId);
        setSeats(prev => prev.map(s => s.id == id ? { ...s, state: 'available', owner: null } : s));
      } else if (type === 'reserved' || msg.type === 'reserved') {
        const id = String(msg.seatId || msg.gheId);
        setSeats(prev => prev.map(s => s.id == id ? { ...s, state: 'da_ban', owner: msg.userId } : s));
        setSelected(prev => prev.filter(x => String(x) !== String(id)));
      } else if (msg.status === 'ok' && msg.action === 'locked') {
        // ack for our lock
        const id = String(msg.seatId);
        setSeats(prev => prev.map(s => s.id == id ? { ...s, state: 'dang_giu', owner: userId } : s));
      } else if (msg.status === 'ok' && msg.action === 'unlocked') {
        const id = String(msg.seatId);
        setSeats(prev => prev.map(s => s.id == id ? { ...s, state: 'available', owner: null } : s));
      } else if (msg.status === 'ok' && msg.action === 'reserved') {
        // ticket payload can be in msg.ticket
        // update seats to reserved
        const gheIds = msg.ticket && msg.ticket.ve_ids ? msg.ticket.ve_ids : (msg.seatId ? [msg.seatId] : []);
        setSeats(prev => prev.map(s => (gheIds.includes(s.id) || gheIds.includes(String(s.id))) ? { ...s, state: 'da_ban' } : s));
        setSelected([]);
      }
    };

    wsService.addListener(handle);

    return () => {
      wsService.removeListener(handle);
      wsService.disconnect();
    };
  }, [scheduleId, userId]);

  const toggleSeat = (seatSoGhe) => {
    const seat = seats.find(s => s.so_ghe == seatSoGhe || s.id == seatSoGhe || String(s.so_ghe) == String(seatSoGhe));
    if (!seat) return;
    // if sold => no action
    if (seat.state === 'da_ban') return;

    // if available -> try lock
    if (seat.state === 'available') {
      // optimistic selected
      setSelected(prev => [...prev, seat.id]);
      wsService.lock(seat.id);
    } else if (seat.state === 'dang_giu' && String(seat.owner) === String(userId)) {
      // owner's seat: unlock
      setSelected(prev => prev.filter(x => String(x) !== String(seat.id)));
      wsService.unlock(seat.id);
    } else {
      // locked by others => ignore or show message
      return;
    }
  };

  const confirmBooking = () => {
    if (selected.length === 0) return;
    // compute total locally
    const total = selected.reduce((acc, id) => {
      const s = seats.find(x => String(x.id) === String(id));
      return acc + (s && s.gia ? Number(s.gia) : 0);
    }, 0);
    wsService.confirm(selected, 'WS', total);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seats</Text>
      <ScrollView contentContainerStyle={styles.grid}>
        {seats.map(seat => (
          <Seat
            key={seat.id}
            seat={seat}
            isSelected={selected.includes(seat.id)}
            onToggle={() => toggleSeat(seat.so_ghe)}
          />
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <Button title={`Confirm (${selected.length})`} onPress={confirmBooking} disabled={selected.length===0} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  footer: { marginTop: 10 }
});
