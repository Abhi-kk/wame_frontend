import { Typography, Paper, Grid } from '@mui/material';

export default function Dashboard() {
    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
                            Messages Sent
                        </Typography>
                        <Typography component="p" variant="h4">
                            0
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
                            Contacts
                        </Typography>
                        <Typography component="p" variant="h4">
                            0
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}
