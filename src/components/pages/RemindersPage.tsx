import React, { useState, useEffect } from 'react';
import { PageTemplate } from '../templates/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Plus, Edit2, Trash2, Clock, AlertCircle, CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { remindersAPI } from '../../services/api';
// @ts-ignore - Audio file import
import notificationSound from '../../assets/Remainder Notification Sound.mp3';

interface Reminder {
  id: string;
  title: string;
  category: 'Supplier' | 'Maintenance' | 'Tax' | 'Staff' | 'General';
  scheduledDateTime: string; // ISO string
  recurrence: 'None' | 'Every 15 mins' | 'Every 1 hour' | 'Daily' | 'Custom Days';
  customDays?: number; // Number of days for custom recurrence
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Completed' | 'Overdue';
  nextTrigger?: string; // ISO string for next trigger time
  createdAt: string;
}

export const RemindersPage: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [deletingReminder, setDeletingReminder] = useState<Reminder | null>(null);
  const [activeNotification, setActiveNotification] = useState<Reminder | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [expandedReminderId, setExpandedReminderId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'General' as Reminder['category'],
    scheduledDate: '',
    scheduledTime: '',
    recurrence: 'None' as Reminder['recurrence'],
    customDays: 1,
    description: '',
    priority: 'Medium' as Reminder['priority'],
  });

  // Load reminders from API
  useEffect(() => {
    loadReminders();
  }, []);

  // Expand reminder after loading if ID is set from dashboard navigation
  useEffect(() => {
    const reminderIdToExpand = sessionStorage.getItem('expandReminderId');
    if (reminderIdToExpand && reminders.length > 0) {
      // Check if the reminder exists in the loaded reminders
      const reminderExists = reminders.some(r => r.id === reminderIdToExpand);
      if (reminderExists) {
        sessionStorage.removeItem('expandReminderId');
        setExpandedReminderId(reminderIdToExpand);
      }
    }
  }, [reminders]);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio(notificationSound);
    audio.preload = 'auto';
    setAudioRef(audio);
    
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Play sound when notification appears
  useEffect(() => {
    if (activeNotification && audioRef) {
      audioRef.play().catch((error) => {
        console.error('Error playing notification sound:', error);
        // Some browsers may block autoplay, this is expected
      });
    }
  }, [activeNotification, audioRef]);

  // Check for due reminders every minute - syncs with system date/time
  useEffect(() => {
    const checkDue = () => {
      // Use system date/time
      const now = new Date();
      const dueReminders = reminders.filter((r) => {
        if (r.status === 'Completed') return false;

        const triggerTime = r.nextTrigger ? new Date(r.nextTrigger) : new Date(r.scheduledDateTime);
        // Check if reminder is due (within the last minute)
        const timeWindow = 60000; // 1 minute window
        return triggerTime <= now && triggerTime > new Date(now.getTime() - timeWindow);
      });

      if (dueReminders.length > 0 && !activeNotification) {
        // Show the first due reminder
        setActiveNotification(dueReminders[0]);
      }
    };

    // Check every minute - syncs with system clock
    const interval = setInterval(checkDue, 60000);

    // Check immediately on mount
    checkDue();

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reminders.length, activeNotification]);

  const loadReminders = async () => {
    try {
      setLoading(true);
      const response = await remindersAPI.getAll();
      console.log('Reminders API Response:', response);
      
      if (response && response.success) {
        // Map backend field names to frontend
        // Backend returns { success: true, data: { reminders: [...], pagination: {...} } }
        const remindersData = response.data?.reminders || response.data || [];
        console.log('Reminders data:', remindersData);
        
        if (Array.isArray(remindersData)) {
          const mappedReminders: Reminder[] = remindersData.map((r: any) => ({
            id: r.id.toString(),
            title: r.title,
            category: r.category,
            scheduledDateTime: r.scheduled_date_time,
            recurrence: r.recurrence,
            customDays: r.custom_days,
            description: r.description || '',
            priority: r.priority,
            status: r.status,
            nextTrigger: r.next_trigger,
            createdAt: r.created_at,
          }));
          setReminders(mappedReminders);
        } else {
          console.error('Reminders data is not an array:', remindersData);
          setReminders([]);
        }
      } else {
        console.error('API response not successful:', response);
        toast.error(response?.error || 'Failed to load reminders');
        setReminders([]);
      }
    } catch (error: any) {
      console.error('Error loading reminders:', error);
      toast.error(error?.message || 'Failed to load reminders. Please check console for details.');
      setReminders([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateNextTrigger = (baseDateTime: string, recurrence: Reminder['recurrence'], customDays?: number): string => {
    const base = new Date(baseDateTime);
    const now = new Date();
    let next = new Date(base);

    // Find the next trigger time
    while (next <= now) {
      switch (recurrence) {
        case 'Every 15 mins':
          next = new Date(next.getTime() + 15 * 60 * 1000);
          break;
        case 'Every 1 hour':
          next = new Date(next.getTime() + 60 * 60 * 1000);
          break;
        case 'Daily':
          next = new Date(next.getTime() + 24 * 60 * 60 * 1000);
          break;
        case 'Custom Days':
          const days = customDays || 1;
          next = new Date(next.getTime() + days * 24 * 60 * 60 * 1000);
          break;
        default:
          return baseDateTime;
      }
    }

    return next.toISOString();
  };


  const resetForm = () => {
    setFormData({
      title: '',
      category: 'General',
      scheduledDate: '',
      scheduledTime: '',
      recurrence: 'None',
      customDays: 1,
      description: '',
      priority: 'Medium',
    });
  };

  const handleAddReminder = () => {
    setEditingReminder(null);
    resetForm();
    setShowAddModal(true);
  };

  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder);
    const scheduled = new Date(reminder.scheduledDateTime);
    setFormData({
      title: reminder.title,
      category: reminder.category,
      scheduledDate: scheduled.toISOString().split('T')[0],
      scheduledTime: scheduled.toTimeString().slice(0, 5),
      recurrence: reminder.recurrence,
      customDays: reminder.customDays || 1,
      description: reminder.description,
      priority: reminder.priority,
    });
    setShowAddModal(true);
  };

  const handleSaveReminder = async () => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!formData.scheduledDate || !formData.scheduledTime) {
      toast.error('Date and time are required');
      return;
    }

    if (formData.recurrence === 'Custom Days' && (!formData.customDays || formData.customDays < 1)) {
      toast.error('Please enter a valid number of days (minimum 1)');
      return;
    }

    try {
      setSubmitting(true);

      const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toISOString();
      const nextTrigger = formData.recurrence !== 'None' 
        ? calculateNextTrigger(scheduledDateTime, formData.recurrence, formData.recurrence === 'Custom Days' ? formData.customDays : undefined)
        : undefined;

      // Map frontend data to backend format
      const reminderData = {
        title: formData.title.trim(),
        category: formData.category,
        scheduled_date_time: scheduledDateTime,
        recurrence: formData.recurrence,
        custom_days: formData.recurrence === 'Custom Days' ? formData.customDays : undefined,
        description: formData.description.trim() || null,
        priority: formData.priority,
        next_trigger: nextTrigger || null,
      };

      console.log('Saving reminder data:', reminderData);
      
      let response;
      if (editingReminder) {
        console.log('Updating reminder:', editingReminder.id);
        response = await remindersAPI.update(editingReminder.id, reminderData);
      } else {
        console.log('Creating new reminder');
        response = await remindersAPI.create(reminderData);
      }

      console.log('Save response:', response);

      if (response && response.success) {
        toast.success(editingReminder ? 'Reminder updated successfully' : 'Reminder added successfully');
        setShowAddModal(false);
        setEditingReminder(null);
        resetForm();
        loadReminders(); // Reload reminders from API
      } else {
        const errorMsg = response?.error || response?.message || 'Failed to save reminder';
        console.error('Save failed:', errorMsg, response);
        toast.error(errorMsg);
      }
    } catch (error: any) {
      console.error('Error saving reminder:', error);
      toast.error(error?.message || 'Failed to save reminder. Please check console for details.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReminder = async () => {
    if (!deletingReminder) return;

    try {
      const response = await remindersAPI.delete(deletingReminder.id);
      if (response.success) {
        toast.success('Reminder deleted successfully');
        setDeletingReminder(null);
        loadReminders(); // Reload reminders from API
      } else {
        toast.error(response.error || 'Failed to delete reminder');
      }
    } catch (error) {
      console.error('Error deleting reminder:', error);
      toast.error('Failed to delete reminder');
    }
  };

  const handleSnooze = async () => {
    if (!activeNotification) return;

    const reminder = activeNotification;
    let nextTrigger: string;

    if (reminder.recurrence !== 'None') {
      // Use the recurrence interval
      nextTrigger = calculateNextTrigger(
        reminder.nextTrigger || reminder.scheduledDateTime,
        reminder.recurrence,
        reminder.customDays
      );
    } else {
      // Default to 15 minutes if no recurrence
      nextTrigger = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    }

    try {
      const response = await remindersAPI.updateStatus(reminder.id, 'Pending', nextTrigger);
      if (response.success) {
        setActiveNotification(null);
        toast.success('Reminder snoozed');
        loadReminders(); // Reload reminders from API
      } else {
        toast.error(response.error || 'Failed to snooze reminder');
      }
    } catch (error) {
      console.error('Error snoozing reminder:', error);
      toast.error('Failed to snooze reminder');
    }
  };

  const handleEndReminder = async () => {
    if (!activeNotification) return;

    try {
      const response = await remindersAPI.updateStatus(activeNotification.id, 'Completed', undefined);
      if (response.success) {
        setActiveNotification(null);
        toast.success('Reminder marked as completed');
        loadReminders(); // Reload reminders from API
      } else {
        toast.error(response.error || 'Failed to complete reminder');
      }
    } catch (error) {
      console.error('Error completing reminder:', error);
      toast.error('Failed to complete reminder');
    }
  };

  const getStatusBadge = (status: Reminder['status']) => {
    switch (status) {
      case 'Pending':
        return (
          <Badge variant="secondary" className="bg-[#dbeafe] text-[#3b82f6] border-[#93c5fd]">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'Completed':
        return (
          <Badge variant="secondary" className="bg-[#d1fae5] text-[#10b981] border-[#6ee7b7]">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'Overdue':
        return (
          <Badge variant="secondary" className="bg-[#fee2e2] text-[#ef4444] border-[#fca5a5]">
            <AlertCircle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-300">
            {status}
          </Badge>
        );
    }
  };

  const getPriorityBadge = (priority: Reminder['priority']) => {
    switch (priority) {
      case 'Low':
        return (
          <Badge variant="secondary" className="bg-[#d1fae5] text-[#10b981] border-[#6ee7b7]">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Low
          </Badge>
        );
      case 'Medium':
        return (
          <Badge variant="secondary" className="bg-[#fef3c7] text-[#f59e0b] border-[#fcd34d]">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Medium
          </Badge>
        );
      case 'High':
        return (
          <Badge variant="secondary" className="bg-[#fee2e2] text-[#ef4444] border-[#fca5a5]">
            <XCircle className="h-3 w-3 mr-1" />
            High
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-300">
            {priority}
          </Badge>
        );
    }
  };

  const toggleRow = (reminderId: string) => {
    setExpandedReminderId(expandedReminderId === reminderId ? null : reminderId);
  };

  const formatDateTime = (dateString: string) => {
    // SQLite CURRENT_TIMESTAMP returns UTC time in format "YYYY-MM-DD HH:MM:SS"
    // We need to parse it as UTC and convert to local time
    let date: Date;
    if (dateString.includes('T')) {
      // ISO format with timezone (e.g., "2025-01-18T10:30:45Z" or "2025-01-18T10:30:45+05:30")
      date = new Date(dateString);
    } else if (dateString.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
      // SQLite format "YYYY-MM-DD HH:MM:SS" - SQLite stores this as UTC
      // Convert to ISO format with UTC indicator
      const isoString = dateString.replace(' ', 'T') + 'Z';
      date = new Date(isoString);
    } else {
      date = new Date(dateString);
    }
    
    // Format in local timezone (same as sidebar)
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return `${dateStr} ${timeStr}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <PageTemplate
      title="Reminders"
      subtitle="Schedule and manage your reminders"
      actions={
        <Button size="sm" onClick={handleAddReminder}>
          <Plus className="h-4 w-4 mr-2" />
          Add Reminder
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Reminders Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Reminders ({reminders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Reminder Title</TableHead>
                    <TableHead>Scheduled Date & Time</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                          Loading reminders...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : reminders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No reminders added yet. Click "Add Reminder" to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    reminders.map((reminder) => (
                      <Collapsible
                        key={reminder.id}
                        open={expandedReminderId === reminder.id}
                        onOpenChange={() => toggleRow(reminder.id)}
                        asChild
                      >
                        <>
                          {/* Main Reminder Row */}
                          <TableRow className="hover:bg-surface-hover cursor-pointer">
                            <TableCell>
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  {expandedReminderId === reminder.id ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </Button>
                              </CollapsibleTrigger>
                            </TableCell>
                            <TableCell className="font-medium">{reminder.title}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{formatDateTime(reminder.scheduledDateTime)}</span>
                              </div>
                            </TableCell>
                            <TableCell>{reminder.category}</TableCell>
                            <TableCell>{getPriorityBadge(reminder.priority)}</TableCell>
                            <TableCell>{getStatusBadge(reminder.status)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditReminder(reminder);
                                  }}
                                  disabled={reminder.status === 'Completed'}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeletingReminder(reminder);
                                  }}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>

                          {/* Expanded Details Row */}
                          <CollapsibleContent asChild>
                            <TableRow className="bg-surface-secondary hover:bg-surface-secondary">
                              <TableCell colSpan={7} className="p-0">
                                <div className="px-12 py-4">
                                  <div className="grid grid-cols-2 gap-6">
                                    {/* Left Column */}
                                    <div className="space-y-4">
                                      <div>
                                        <p className="text-sm font-semibold mb-2 text-muted-foreground">Description</p>
                                        <p className="text-sm text-foreground whitespace-pre-wrap bg-background border rounded-lg p-3">
                                          {reminder.description || 'No description provided'}
                                        </p>
                                      </div>
                                      
                                      <div>
                                        <p className="text-sm font-semibold mb-2 text-muted-foreground">Recurrence</p>
                                        <Badge variant="outline" className="bg-background">
                                          {reminder.recurrence}
                                          {reminder.recurrence === 'Custom Days' && reminder.customDays && (
                                            <span className="ml-1">({reminder.customDays} days)</span>
                                          )}
                                        </Badge>
                                      </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-4">
                                      <div>
                                        <p className="text-sm font-semibold mb-2 text-muted-foreground">Scheduled Information</p>
                                        <div className="bg-background border rounded-lg p-3 space-y-2">
                                          <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                              <p className="text-xs text-muted-foreground">Scheduled Date</p>
                                              <p className="text-sm font-medium">{formatDate(reminder.scheduledDateTime)}</p>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                              <p className="text-xs text-muted-foreground">Scheduled Time</p>
                                              <p className="text-sm font-medium">{formatTime(reminder.scheduledDateTime)}</p>
                                            </div>
                                          </div>
                                          {reminder.nextTrigger && (
                                            <div className="flex items-center gap-2 pt-2 border-t">
                                              <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                              <div>
                                                <p className="text-xs text-muted-foreground">Next Trigger</p>
                                                <p className="text-sm font-medium">{formatDateTime(reminder.nextTrigger)}</p>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      <div>
                                        <p className="text-sm font-semibold mb-2 text-muted-foreground">Additional Information</p>
                                        <div className="bg-background border rounded-lg p-3 space-y-2">
                                          <div className="flex justify-between">
                                            <span className="text-xs text-muted-foreground">Created At:</span>
                                            <span className="text-sm font-medium">{formatDateTime(reminder.createdAt)}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-xs text-muted-foreground">Reminder ID:</span>
                                            <span className="text-sm font-medium font-mono">{reminder.id}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          </CollapsibleContent>
                        </>
                      </Collapsible>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Reminder Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingReminder ? 'Edit Reminder' : 'Add New Reminder'}</DialogTitle>
            <DialogDescription>
              {editingReminder ? 'Update reminder details' : 'Schedule a new reminder'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title/Task *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Payment to Supplier"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: Reminder['category']) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Supplier">Supplier</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Tax">Tax</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority Level *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: Reminder['priority']) =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Time *</Label>
                <Input
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Recurrence/Interval</Label>
              <Select
                value={formData.recurrence}
                onValueChange={(value: Reminder['recurrence']) =>
                  setFormData({ ...formData, recurrence: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select recurrence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Every 15 mins">Every 15 mins</SelectItem>
                  <SelectItem value="Every 1 hour">Every 1 hour</SelectItem>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Custom Days">Custom Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.recurrence === 'Custom Days' && (
              <div className="space-y-2">
                <Label>Number of Days *</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.customDays}
                  onChange={(e) => setFormData({ ...formData, customDays: parseInt(e.target.value) || 1 })}
                  placeholder="Enter number of days"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter detailed notes..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddModal(false);
                setEditingReminder(null);
                resetForm();
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveReminder} 
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                  {editingReminder ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                editingReminder ? 'Update Reminder' : 'Add Reminder'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingReminder} onOpenChange={() => setDeletingReminder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Reminder</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingReminder?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingReminder(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteReminder}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notification Popup */}
      <Dialog open={!!activeNotification} onOpenChange={() => setActiveNotification(null)}>
        <DialogContent 
          className="bg-white border-2 border-gray-200" 
          style={{ 
            maxWidth: '500px',
            backgroundColor: '#ffffff',
            opacity: 1
          }}
        >
          <DialogHeader>
            <div className="flex items-center gap-3 pb-2">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <AlertCircle className="h-5 w-5" style={{ color: '#003e90' }} />
              </div>
              <DialogTitle className="text-xl text-gray-900">Reminder Alert</DialogTitle>
            </div>
            {activeNotification && (
              <div className="space-y-4 pt-2">
                {/* Title */}
                <div className="border-b pb-3">
                  <p className="font-bold text-lg text-gray-900">{activeNotification.title}</p>
                </div>

                {/* Category and Priority */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Category:</span>
                    <Badge variant="outline" className="bg-gray-50 text-gray-800">
                      {activeNotification.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Priority:</span>
                    {getPriorityBadge(activeNotification.priority)}
                  </div>
                </div>

                {/* Date & Time */}
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Scheduled Date & Time</p>
                      <p className="text-sm text-gray-900 font-semibold">
                        {formatDateTime(activeNotification.scheduledDateTime)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {activeNotification.description ? (
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                    <p className="text-xs text-gray-600 font-medium mb-2">Description</p>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                      {activeNotification.description}
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                    <p className="text-xs text-gray-500 italic">No description provided</p>
                  </div>
                )}
              </div>
            )}
          </DialogHeader>
          <DialogFooter className="gap-2 pt-4 border-t">
            <Button
              onClick={handleSnooze}
              className="flex-1"
            >
              Ok (Snooze)
            </Button>
            <Button
              onClick={handleEndReminder}
              variant="destructive"
              className="flex-1"
            >
              End
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
};

