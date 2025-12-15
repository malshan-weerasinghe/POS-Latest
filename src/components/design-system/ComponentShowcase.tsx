import React from 'react';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Switch } from '../ui/switch';
import { Checkbox } from '../ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export const ComponentShowcase: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Badges & Tags */}
      <div>
        <h4 className="mb-4">Badges & Tags</h4>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Success</Badge>
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Warning</Badge>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Info</Badge>
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">Premium</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="rounded-full">Pill Badge</Badge>
            <Badge className="rounded-sm">Square Badge</Badge>
            <Badge className="gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              With Dot
            </Badge>
          </div>
        </div>
      </div>

      {/* Avatars */}
      <div>
        <h4 className="mb-4">Avatars</h4>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Avatar className="h-12 w-12">
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar className="h-10 w-10">
            <AvatarFallback>CD</AvatarFallback>
          </Avatar>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">EF</AvatarFallback>
          </Avatar>
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarFallback>ON</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
          </div>
        </div>
      </div>

      {/* Switches & Checkboxes */}
      <div>
        <h4 className="mb-4">Switches & Checkboxes</h4>
        <div className="space-y-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Switch id="switch-1" />
              <label htmlFor="switch-1" className="text-sm">Toggle switch</label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="switch-2" defaultChecked />
              <label htmlFor="switch-2" className="text-sm">Checked switch</label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="switch-3" disabled />
              <label htmlFor="switch-3" className="text-sm text-muted-foreground">Disabled</label>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Checkbox id="check-1" />
              <label htmlFor="check-1" className="text-sm">Checkbox</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="check-2" defaultChecked />
              <label htmlFor="check-2" className="text-sm">Checked</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="check-3" disabled />
              <label htmlFor="check-3" className="text-sm text-muted-foreground">Disabled</label>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div>
        <h4 className="mb-4">Tabs</h4>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4 p-4 border border-border rounded-lg">
            <p className="text-sm text-muted-foreground">Overview content goes here...</p>
          </TabsContent>
          <TabsContent value="analytics" className="mt-4 p-4 border border-border rounded-lg">
            <p className="text-sm text-muted-foreground">Analytics content goes here...</p>
          </TabsContent>
          <TabsContent value="reports" className="mt-4 p-4 border border-border rounded-lg">
            <p className="text-sm text-muted-foreground">Reports content goes here...</p>
          </TabsContent>
          <TabsContent value="settings" className="mt-4 p-4 border border-border rounded-lg">
            <p className="text-sm text-muted-foreground">Settings content goes here...</p>
          </TabsContent>
        </Tabs>
      </div>

      {/* Accordion */}
      <div>
        <h4 className="mb-4">Accordion</h4>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>What is your return policy?</AccordionTrigger>
            <AccordionContent>
              We offer a 30-day return policy for all unused items in their original packaging. 
              Please contact our support team to initiate a return.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>How do I track my order?</AccordionTrigger>
            <AccordionContent>
              Once your order ships, you'll receive a tracking number via email. 
              You can use this number to track your package on our website or the carrier's site.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Do you offer international shipping?</AccordionTrigger>
            <AccordionContent>
              Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times 
              vary by location and will be calculated at checkout.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Alerts */}
      <div>
        <h4 className="mb-4">Alerts & Notifications</h4>
        <div className="space-y-4">
          <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/20">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              This is an informational message to keep you updated.
            </AlertDescription>
          </Alert>

          <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Your changes have been saved successfully.
            </AlertDescription>
          </Alert>

          <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/20">
            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Please review your information before proceeding.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              There was an error processing your request. Please try again.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Progress */}
      <div>
        <h4 className="mb-4">Progress Bars</h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Upload Progress</span>
              <span className="text-muted-foreground">25%</span>
            </div>
            <Progress value={25} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing</span>
              <span className="text-muted-foreground">60%</span>
            </div>
            <Progress value={60} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Complete</span>
              <span className="text-muted-foreground">100%</span>
            </div>
            <Progress value={100} className="h-3" />
          </div>
        </div>
      </div>

      {/* Separators */}
      <div>
        <h4 className="mb-4">Separators</h4>
        <div className="space-y-4">
          <div>
            <p className="text-sm mb-2">Section One</p>
            <Separator />
            <p className="text-sm mt-2">Section Two</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">Left</span>
            <Separator orientation="vertical" className="h-6" />
            <span className="text-sm">Center</span>
            <Separator orientation="vertical" className="h-6" />
            <span className="text-sm">Right</span>
          </div>
        </div>
      </div>
    </div>
  );
};
