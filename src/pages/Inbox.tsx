import { useState, useEffect } from 'react';
import { Typography, Paper, List, ListItem, TextField, Button, MenuItem, Select, FormControl, InputLabel, Grid } from '@mui/material';
import client from '../api/client';

interface Message {
    id: number;
    content: string;
    channel: string;
    direction: string;
    created_at: string;
    contact_id: number;
}

interface Contact {
    id: number;
    name: string;
}

export default function Inbox() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContact, setSelectedContact] = useState('');
    const [channel, setChannel] = useState('whatsapp');
    const [content, setContent] = useState('');

    const fetchData = async () => {
        try {
            const [msgRes, contactRes] = await Promise.all([
                client.get('/messages'),
                client.get('/contacts')
            ]);
            setMessages(msgRes.data);
            setContacts(contactRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    const handleSend = async () => {
        if (!selectedContact || !content) return;
        try {
            await client.post('/messages/send', {
                contact_id: Number(selectedContact),
                channel,
                content
            });
            setContent('');
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
                <Typography variant="h5" gutterBottom>Inbox</Typography>
                <Paper sx={{ height: '60vh', overflow: 'auto', p: 2 }}>
                    <List>
                        {messages.map((msg) => (
                            <ListItem key={msg.id} sx={{ flexDirection: 'column', alignItems: msg.direction === 'outbound' ? 'flex-end' : 'flex-start' }}>
                                <Paper sx={{ p: 1, bgcolor: msg.direction === 'outbound' ? '#e3f2fd' : '#f5f5f5' }}>
                                    <Typography variant="body1">{msg.content}</Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {msg.channel} • {new Date(msg.created_at).toLocaleTimeString()}
                                    </Typography>
                                </Paper>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="h5" gutterBottom>Send Message</Typography>
                <Paper sx={{ p: 2 }}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Contact</InputLabel>
                        <Select
                            value={selectedContact}
                            label="Contact"
                            onChange={(e) => setSelectedContact(e.target.value)}
                        >
                            {contacts.map((c) => (
                                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Channel</InputLabel>
                        <Select
                            value={channel}
                            label="Channel"
                            onChange={(e) => setChannel(e.target.value)}
                        >
                            <MenuItem value="whatsapp">WhatsApp</MenuItem>
                            <MenuItem value="email">Email</MenuItem>
                            <MenuItem value="sms">SMS</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                        label="Message"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <Button variant="contained" fullWidth onClick={handleSend} disabled={!selectedContact || !content}>
                        Send
                    </Button>
                </Paper>
            </Grid>
        </Grid>
    );
}
