import React from 'react';
import { PageTemplate } from '../templates/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { RefreshCw, Cloud, CheckCircle, XCircle, AlertCircle, Database } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

export const SyncCenterPage: React.FC = () => {
  return (
    <PageTemplate
      breadcrumbs={[{ label: 'System' }, { label: 'Sync Center' }]}
      title="Sync Center"
      subtitle="Manage data synchronization and backups"
      actions={
        <Button size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Sync Now
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Sync Status */}
        <div className="grid grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 'var(--text-body-m)' }}>Last Sync</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-1" style={{ 
                fontSize: 'var(--text-headline-s)',
                fontWeight: 'var(--font-weight-semibold)'
              }}>
                2 mins ago
              </p>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                <CheckCircle className="h-3 w-3 mr-1" />
                Success
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 'var(--text-body-m)' }}>Sync Frequency</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground" style={{ 
                fontSize: 'var(--text-headline-s)',
                fontWeight: 'var(--font-weight-semibold)'
              }}>
                Every 15 mins
              </p>
              <p className="text-muted-foreground mt-1" style={{ fontSize: 'var(--text-caption)' }}>
                Auto sync enabled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 'var(--text-body-m)' }}>Data Synced</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground" style={{ 
                fontSize: 'var(--text-headline-s)',
                fontWeight: 'var(--font-weight-semibold)'
              }}>
                12,458
              </p>
              <p className="text-muted-foreground mt-1" style={{ fontSize: 'var(--text-caption)' }}>
                Records today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 'var(--text-body-m)' }}>Cloud Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-green-600" />
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Connected
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Sync Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Sync Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { module: 'Sales Data', progress: 100, status: 'completed' },
              { module: 'Inventory', progress: 100, status: 'completed' },
              { module: 'Customers', progress: 75, status: 'syncing' },
              { module: 'Suppliers', progress: 0, status: 'pending' },
            ].map((item) => (
              <div key={item.module} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {item.status === 'syncing' && <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />}
                    {item.status === 'pending' && <AlertCircle className="h-4 w-4 text-muted-foreground" />}
                    <span className="text-foreground" style={{ fontSize: 'var(--text-body-m)' }}>
                      {item.module}
                    </span>
                  </div>
                  <span className="text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>
                    {item.progress}%
                  </span>
                </div>
                <Progress value={item.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Module Sync Status */}
        <Card>
          <CardHeader>
            <CardTitle>Module Sync Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { module: 'Sales & Billing', lastSync: '2 mins ago', records: 145, status: 'success' },
                { module: 'Items & Inventory', lastSync: '2 mins ago', records: 1234, status: 'success' },
                { module: 'Suppliers & GRN', lastSync: '15 mins ago', records: 56, status: 'success' },
                { module: 'Customers', lastSync: '5 mins ago', records: 890, status: 'syncing' },
                { module: 'Reports', lastSync: '1 hour ago', records: 23, status: 'warning' },
                { module: 'Settings', lastSync: '3 hours ago', records: 12, status: 'success' },
              ].map((item) => (
                <div key={item.module} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-foreground" style={{ fontSize: 'var(--text-body-m)' }}>
                        {item.module}
                      </p>
                      <p className="text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>
                        {item.records} records • {item.lastSync}
                      </p>
                    </div>
                  </div>
                  {item.status === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                  {item.status === 'syncing' && <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />}
                  {item.status === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-600" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sync History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sync History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: '2 mins ago', type: 'Auto Sync', status: 'Success', records: 145 },
                { time: '17 mins ago', type: 'Auto Sync', status: 'Success', records: 132 },
                { time: '32 mins ago', type: 'Manual Sync', status: 'Success', records: 256 },
                { time: '1 hour ago', type: 'Auto Sync', status: 'Failed', records: 0 },
                { time: '1 hour 15 mins ago', type: 'Auto Sync', status: 'Success', records: 178 },
              ].map((sync, i) => (
                <div key={i} className="flex items-center justify-between p-3 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    {sync.status === 'Success' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <div>
                      <p className="text-foreground" style={{ fontSize: 'var(--text-body-m)' }}>
                        {sync.type}
                      </p>
                      <p className="text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>
                        {sync.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={sync.status === 'Success' ? 'secondary' : 'destructive'}>
                      {sync.status}
                    </Badge>
                    <p className="text-muted-foreground mt-1" style={{ fontSize: 'var(--text-caption)' }}>
                      {sync.records} records
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sync Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Sync Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              'Enable Auto Sync',
              'Sync on WiFi Only',
              'Sync in Background',
              'Notify on Sync Completion',
              'Retry Failed Syncs',
            ].map((setting) => (
              <div key={setting} className="flex items-center justify-between p-3 border rounded">
                <span className="text-foreground" style={{ fontSize: 'var(--text-body-m)' }}>
                  {setting}
                </span>
                <div className="h-6 w-11 bg-primary rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};
