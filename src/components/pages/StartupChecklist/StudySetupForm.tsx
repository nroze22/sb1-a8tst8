import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';

const studySetupSchema = z.object({
  studyTitle: z.string().min(1, 'Study title is required'),
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  estimatedDuration: z.string().min(1, 'Estimated duration is required'),
  siteCount: z.string().min(1, 'Number of sites is required'),
  regulatoryPath: z.enum(['IND', 'IDE', 'HDE', 'None']),
  fundingSource: z.string().min(1, 'Funding source is required'),
  targetEnrollment: z.string().min(1, 'Target enrollment is required'),
  monitoringStrategy: z.string().min(1, 'Monitoring strategy is required'),
  dataManagement: z.string().min(1, 'Data management plan is required'),
  safetyReporting: z.string().min(1, 'Safety reporting plan is required'),
});

type StudySetupValues = z.infer<typeof studySetupSchema>;

interface StudySetupFormProps {
  onSubmit: (data: StudySetupValues) => void;
  isSubmitting: boolean;
}

export function StudySetupForm({ onSubmit, isSubmitting }: StudySetupFormProps) {
  const form = useForm<StudySetupValues>({
    resolver: zodResolver(studySetupSchema),
    defaultValues: {
      studyTitle: '',
      startDate: new Date(),
      estimatedDuration: '',
      siteCount: '',
      regulatoryPath: 'None',
      fundingSource: '',
      targetEnrollment: '',
      monitoringStrategy: '',
      dataManagement: '',
      safetyReporting: '',
    },
  });

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="studyTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Study Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter study title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estimatedDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Duration</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 12 months" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="siteCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Sites</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter number of sites" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="regulatoryPath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Regulatory Path</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select regulatory path" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="IND">IND</SelectItem>
                      <SelectItem value="IDE">IDE</SelectItem>
                      <SelectItem value="HDE">HDE</SelectItem>
                      <SelectItem value="None">None</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fundingSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funding Source</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter funding source" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetEnrollment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Enrollment</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter target enrollment" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="monitoringStrategy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monitoring Strategy</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your monitoring strategy"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dataManagement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data Management Plan</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your data management plan"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="safetyReporting"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Safety Reporting Plan</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your safety reporting plan"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Checklist...
              </>
            ) : (
              'Generate Study Startup Checklist'
            )}
          </Button>
        </form>
      </Form>
    </Card>
  );
}