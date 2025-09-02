# FORM VALIDATION - M5 MAX

> **Purpose**: Complete guide to form validation schemas, React Hook Form patterns, error handling, and lead scoring system.

## OVERVIEW

**Form Library**: React Hook Form 7.61.1 (`package.json:58`)  
**Validation**: Zod 3.25.76 (`package.json:68`)  
**Integration**: @hookform/resolvers 3.10.0 (`package.json:16`)  
**UI Components**: shadcn/ui Form components (`src/shared/ui/form.tsx`)  
**Schema Location**: `src/shared/types/forms.ts:1-37`

## VALIDATION ARCHITECTURE

### Zod Schema System
**Pattern**: Type-safe schema-first validation with runtime checking  
**Error Messages**: Localized Portuguese validation messages  
**Type Generation**: Automatic TypeScript types from Zod schemas  
**Integration**: Seamless React Hook Form resolver integration

### Form Components Structure
```
src/shared/modal/
├── QualificationForm.tsx  // Form container with schema resolution
├── B2BForm.tsx           // B2B form field implementation
└── ConversionModal.tsx   // Modal wrapper with form integration
```

## ZOD SCHEMAS

### B2B Form Schema (`forms.ts:4-19`)

```typescript
export const B2BFormSchema = z.object({
  eventType: z.enum([
    'reveillon', 
    'festa-junina', 
    'casamento', 
    'festival', 
    'outro'
  ]),
  cityUF: z.string().min(1, 'Cidade/UF obrigatório'),
  eventDate: z.string().min(1, 'Data obrigatória'),
  attendeesRange: z.enum([
    'ate-500', 
    '500-5k', 
    '5k-20k', 
    '20k+'
  ]),
  budgetRange: z.enum([
    '5k-15k', 
    '15k-50k', 
    '50k-200k', 
    '200k+'
  ]),
  venueType: z.enum(['indoor', 'outdoor']),
  hasNoiseRestrictions: z.boolean(),
  needsMusicSync: z.boolean(),
  contactName: z.string().min(1, 'Nome obrigatório'),
  contactEmail: z.string().email('Email inválido'),
  contactPhone: z.string().min(10, 'Telefone inválido'),
  companyName: z.string().optional(),
  additionalInfo: z.string().optional(),
  attachments: z.array(z.instanceof(File)).optional()
});
```

### Type Generation (`forms.ts:21`)
```typescript
export type B2BFormData = z.infer<typeof B2BFormSchema>;
```

### Form Submission Types (`forms.ts:25-30`)
```typescript
export interface FormSubmissionResult {
  success: boolean;
  leadScore: number;
  redirectUrl?: string;
  message: string;
}
```

### Context Types (`forms.ts:32-37`)
```typescript
export interface ConversionContext {
  source: string;
  audience: 'b2b' | 'general';
  page?: string;
  productId?: string;
}
```

## VALIDATION PATTERNS

### 1. Required Field Validation
```typescript
// String field with minimum length
cityUF: z.string().min(1, 'Cidade/UF obrigatório'),

// Email validation with custom message
contactEmail: z.string().email('Email inválido'),

// Phone validation with minimum length
contactPhone: z.string().min(10, 'Telefone inválido'),
```

### 2. Enum Validation
```typescript
// Event type with specific options
eventType: z.enum(['reveillon', 'festa-junina', 'casamento', 'festival', 'outro']),

// Budget ranges for lead scoring
budgetRange: z.enum(['5k-15k', '15k-50k', '50k-200k', '200k+']),
```

### 3. Boolean Validation  
```typescript
// Boolean flags for event requirements
hasNoiseRestrictions: z.boolean(),
needsMusicSync: z.boolean(),
```

### 4. Optional Field Validation
```typescript
// Optional text fields
companyName: z.string().optional(),
additionalInfo: z.string().optional(),

// Optional file attachments
attachments: z.array(z.instanceof(File)).optional()
```

### 5. Complex Validation with Refinement
```typescript
// Example: Terms agreement validation
agreeTerms: z.boolean().refine(val => val === true, {
  message: 'Você deve concordar com os termos'
})
```

## REACT HOOK FORM INTEGRATION

### Form Setup Pattern (`QualificationForm.tsx:27-30`)

```typescript
const form = useForm<B2BFormData>({
  resolver: zodResolver(B2BFormSchema),
  defaultValues: initialData || {
    eventType: 'reveillon',
    hasNoiseRestrictions: false,
    needsMusicSync: false,
    // ... other defaults
  }
});
```

### Form Field Pattern (`B2BForm.tsx:31-54`)

```typescript
<FormField
  control={form.control}
  name="eventType"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Tipo de Evento</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="reveillon">Réveillon</SelectItem>
          <SelectItem value="festa-junina">Festa Junina</SelectItem>
          <SelectItem value="casamento">Casamento</SelectItem>
          <SelectItem value="festival">Festival</SelectItem>
          <SelectItem value="outro">Outro</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Input Field Pattern (`B2BForm.tsx:56-68`)

```typescript
<FormField
  control={form.control}
  name="eventDate"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Data do Evento</FormLabel>
      <FormControl>
        <Input type="date" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Checkbox Field Pattern

```typescript
<FormField
  control={form.control}
  name="hasNoiseRestrictions"
  render={({ field }) => (
    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
      <FormControl>
        <Checkbox
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      </FormControl>
      <div className="space-y-1 leading-none">
        <FormLabel>Há restrições de ruído no local?</FormLabel>
      </div>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Textarea Field Pattern

```typescript
<FormField
  control={form.control}
  name="additionalInfo"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Informações Adicionais</FormLabel>
      <FormControl>
        <Textarea 
          placeholder="Descreva requisitos específicos..."
          {...field} 
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

## FORM COMPONENTS SYSTEM

### Form Component Hierarchy

```typescript
// Form wrapper from shadcn/ui
import { Form } from '@/shared/ui/form';

// Form field components
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/shared/ui/form';
```

### FormField Structure (`form.tsx:29-40`)

```typescript
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}
```

### Form Item Components

#### FormItem (`form.tsx:55-65`)
```typescript
const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId()
    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn("space-y-2", className)} {...props} />
      </FormItemContext.Provider>
    )
  }
)
```

#### FormLabel (`form.tsx:70-82`)
```typescript
const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()
  
  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
```

#### FormMessage (`form.tsx:120-134`)
```typescript
const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children
  
  if (!body) {
    return null
  }
  
  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
```

## ERROR HANDLING PATTERNS

### Field-Level Validation Errors

#### Display Pattern
```typescript
// Automatic error display with FormMessage
<FormField
  control={form.control}
  name="contactEmail"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input type="email" placeholder="seu@email.com" {...field} />
      </FormControl>
      <FormMessage /> {/* Automatically shows validation errors */}
    </FormItem>
  )}
/>
```

#### Error State Styling (`form.tsx:78-81`)
```typescript
// Labels turn red when field has error
const { error } = useFormField()
className={cn(error && "text-destructive", className)}
```

### Form-Level Error Handling

#### Submission Error Pattern
```typescript
const handleSubmit = async (data: B2BFormData) => {
  try {
    const result = await submitForm(data);
    if (result.success) {
      onSuccess(result);
    } else {
      // Handle submission errors
      setSubmissionError(result.message);
    }
  } catch (error) {
    // Handle network/unexpected errors
    setSubmissionError('Erro inesperado. Tente novamente.');
  }
};
```

#### Custom Error Messages

```typescript
// Portuguese error messages in schema
contactEmail: z.string().email('Email inválido'),
contactPhone: z.string().min(10, 'Telefone inválido'),
cityUF: z.string().min(1, 'Cidade/UF obrigatório'),
eventDate: z.string().min(1, 'Data obrigatória'),
```

## LEAD SCORING SYSTEM

### Lead Score Calculation (`QualificationForm.tsx:32-69`)

#### Budget-Based Scoring
```typescript
const budgetScores = {
  '200k+': 30,
  '50k-200k': 20,
  '15k-50k': 10,
  '5k-15k': 5
};
score += budgetScores[data.budgetRange] || 0;
```

#### Attendees-Based Scoring
```typescript
const attendeesScores = {
  '20k+': 15,
  '5k-20k': 10,
  '500-5k': 5,
  'ate-500': 2
};
score += attendeesScores[data.attendeesRange] || 0;
```

#### Date Proximity Scoring
```typescript
if (data.eventDate) {
  const eventDate = new Date(data.eventDate);
  const now = new Date();
  const daysDiff = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
  
  if (daysDiff <= 30) score += 20;      // Urgent events
  else if (daysDiff <= 90) score += 15; // Near-term events
  else if (daysDiff <= 180) score += 10; // Medium-term events
  else score += 5;                       // Long-term events
}
```

#### Company Bonus Scoring
```typescript
// Company name indicates B2B lead
if (data.companyName) score += 10;
```

#### Score Capping
```typescript
return Math.min(score, 100); // Maximum score of 100
```

### Lead Score Ranges

**High Priority (70-100)**: Large budget + Many attendees + Near event date  
**Medium Priority (40-69)**: Moderate budget + Medium attendees + Some urgency  
**Low Priority (0-39)**: Small budget + Few attendees + Distant event date

## FORM SUBMISSION FLOW

### Complete Form Flow

```typescript
const QualificationForm: React.FC<QualificationFormProps> = ({
  audience,
  onSubmit,
  onCancel,
  initialData
}) => {
  // 1. Schema Selection
  const getSchema = () => {
    return B2BFormSchema; // Currently only B2B supported
  };

  // 2. Form Setup
  const form = useForm({
    resolver: zodResolver(getSchema()),
    defaultValues: initialData || {}
  });

  // 3. Lead Scoring
  const calculateLeadScore = (data: Record<string, unknown>): number => {
    // ... scoring logic
  };

  // 4. Form Submission
  const handleSubmit = (data: Record<string, unknown>) => {
    const leadScore = calculateLeadScore(data);
    
    onSubmit({
      ...data,
      leadScore,
      submissionTime: new Date().toISOString(),
      audience
    });
  };

  // 5. Form Rendering
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <B2BForm form={form} />
        <FormActions onCancel={onCancel} />
      </form>
    </Form>
  );
};
```

## ADVANCED VALIDATION PATTERNS

### 1. Conditional Validation

```typescript
// Validate company name only for B2B audience
const getSchema = (audience: AudienceType) => {
  const baseSchema = z.object({
    contactName: z.string().min(1, 'Nome obrigatório'),
    contactEmail: z.string().email('Email inválido'),
    // ... other fields
  });

  if (audience === 'b2b') {
    return baseSchema.extend({
      companyName: z.string().min(1, 'Nome da empresa obrigatório'),
      businessRole: z.string().min(1, 'Cargo obrigatório'),
    });
  }

  return baseSchema;
};
```

### 2. Cross-Field Validation

```typescript
const EventFormSchema = z.object({
  eventDate: z.string().min(1, 'Data obrigatória'),
  setupDate: z.string().optional(),
  // ... other fields
}).refine((data) => {
  if (data.setupDate && data.eventDate) {
    const setup = new Date(data.setupDate);
    const event = new Date(data.eventDate);
    return setup <= event;
  }
  return true;
}, {
  message: 'Data de montagem deve ser anterior ao evento',
  path: ['setupDate'], // Error shows on setupDate field
});
```

### 3. File Upload Validation

```typescript
const attachments = z.array(
  z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Arquivo deve ter no máximo 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type),
      'Apenas imagens (JPG, PNG) e PDFs são permitidos'
    )
).optional();
```

### 4. Phone Number Validation

```typescript
const phoneRegex = /^(?:\+55\s?)?(?:\(?[1-9][1-9]\)?\s?)?(?:9\s?)?[0-9]{4}\s?[0-9]{4}$/;

contactPhone: z.string()
  .min(10, 'Telefone deve ter pelo menos 10 dígitos')
  .regex(phoneRegex, 'Formato de telefone inválido')
  .transform((val) => val.replace(/\D/g, '')) // Remove non-digits
```

## FORM UI PATTERNS

### 1. Multi-Column Layout

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <FormField name="eventType" /* ... */ />
  <FormField name="eventDate" /* ... */ />
</div>
```

### 2. Section Grouping

```typescript
<div className="space-y-6">
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Dados do Evento</h3>
    {/* Event fields */}
  </div>
  
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Dados de Contato</h3>
    {/* Contact fields */}
  </div>
</div>
```

### 3. Form Actions Pattern

```typescript
<div className="flex gap-4 pt-6">
  <Button 
    type="button" 
    variant="outline" 
    onClick={onCancel}
    className="flex-1"
  >
    Cancelar
  </Button>
  <Button 
    type="submit" 
    variant="cta"
    disabled={!form.formState.isValid || form.formState.isSubmitting}
    className="flex-1"
  >
    {form.formState.isSubmitting ? 'Enviando...' : 'Enviar'}
  </Button>
</div>
```

### 4. Loading States

```typescript
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (data: B2BFormData) => {
  setIsSubmitting(true);
  try {
    await submitForm(data);
  } finally {
    setIsSubmitting(false);
  }
};

// In form button
<Button 
  type="submit" 
  disabled={isSubmitting}
>
  {isSubmitting ? 'Enviando...' : 'Enviar'}
</Button>
```

## FORM ACCESSIBILITY

### 1. Proper Labeling

```typescript
// FormLabel automatically associates with FormControl
<FormField
  control={form.control}
  name="contactName"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Nome Completo</FormLabel> {/* Proper label association */}
      <FormControl>
        <Input {...field} />
      </FormControl>
    </FormItem>
  )}
/>
```

### 2. Error Announcements

```typescript
// FormMessage provides screen reader announcements
<FormMessage /> {/* aria-live region for errors */}
```

### 3. Required Field Indication

```typescript
<FormLabel>
  Nome Completo <span className="text-destructive">*</span>
</FormLabel>
```

### 4. Field Descriptions

```typescript
<FormField
  control={form.control}
  name="eventDate"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Data do Evento</FormLabel>
      <FormControl>
        <Input type="date" {...field} />
      </FormControl>
      <FormDescription>
        Selecione a data prevista para o evento
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

## TESTING PATTERNS

### 1. Schema Testing

```typescript
import { B2BFormSchema } from '@/shared/types/forms';

describe('B2BFormSchema', () => {
  it('should validate valid B2B form data', () => {
    const validData = {
      eventType: 'casamento',
      cityUF: 'Brasília/DF',
      eventDate: '2024-12-31',
      attendeesRange: '500-5k',
      budgetRange: '50k-200k',
      venueType: 'outdoor',
      hasNoiseRestrictions: false,
      needsMusicSync: true,
      contactName: 'João Silva',
      contactEmail: 'joao@email.com',
      contactPhone: '11999999999'
    };

    const result = B2BFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const invalidData = {
      // ... valid fields
      contactEmail: 'invalid-email'
    };

    const result = B2BFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Email inválido');
  });
});
```

### 2. Form Component Testing

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import QualificationForm from './QualificationForm';

describe('QualificationForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  it('should submit form with valid data', async () => {
    render(
      <QualificationForm
        audience="b2b"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Fill out form
    fireEvent.change(screen.getByLabelText(/Nome Completo/i), {
      target: { value: 'João Silva' }
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'joao@email.com' }
    });
    // ... fill other fields

    fireEvent.click(screen.getByText('Enviar'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          contactName: 'João Silva',
          contactEmail: 'joao@email.com',
          leadScore: expect.any(Number)
        })
      );
    });
  });

  it('should show validation errors for invalid data', async () => {
    render(
      <QualificationForm
        audience="b2b"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Submit without filling required fields
    fireEvent.click(screen.getByText('Enviar'));

    await waitFor(() => {
      expect(screen.getByText('Nome obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Email inválido')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
```

### 3. Lead Scoring Testing

```typescript
import { calculateLeadScore } from './QualificationForm';

describe('Lead Scoring', () => {
  it('should calculate high score for premium lead', () => {
    const premiumLead = {
      budgetRange: '200k+',        // +30 points
      attendeesRange: '20k+',      // +15 points
      eventDate: '2024-02-15',     // +20 points (30 days out)
      companyName: 'Big Corp'      // +10 points
    };

    const score = calculateLeadScore(premiumLead);
    expect(score).toBe(75);
  });

  it('should calculate low score for basic lead', () => {
    const basicLead = {
      budgetRange: '5k-15k',       // +5 points
      attendeesRange: 'ate-500',   // +2 points
      eventDate: '2025-06-15',     // +5 points (distant)
      // No company name          // +0 points
    };

    const score = calculateLeadScore(basicLead);
    expect(score).toBe(12);
  });
});
```

## PERFORMANCE OPTIMIZATION

### 1. Form State Optimization

```typescript
// Use React Hook Form's built-in optimizations
const form = useForm({
  resolver: zodResolver(schema),
  mode: 'onBlur', // Validate on blur instead of onChange
  reValidateMode: 'onChange', // Re-validate on change after first error
});
```

### 2. Conditional Field Rendering

```typescript
// Only render expensive components when needed
const showAdvancedFields = form.watch('eventType') === 'festival';

return (
  <div>
    {/* Basic fields */}
    {showAdvancedFields && (
      <Suspense fallback={<Skeleton />}>
        <AdvancedFields form={form} />
      </Suspense>
    )}
  </div>
);
```

### 3. Schema Memoization

```typescript
const getSchema = useMemo(() => {
  return audience === 'b2b' ? B2BFormSchema : GeneralFormSchema;
}, [audience]);
```

## FUTURE EXTENSIBILITY

### Schema Extension Pattern

```typescript
// Base schema for common fields
const BaseFormSchema = z.object({
  contactName: z.string().min(1, 'Nome obrigatório'),
  contactEmail: z.string().email('Email inválido'),
  contactPhone: z.string().min(10, 'Telefone inválido'),
});

// B2B-specific extension
export const B2BFormSchema = BaseFormSchema.extend({
  eventType: z.enum(['reveillon', 'festa-junina', 'casamento', 'festival', 'outro']),
  budgetRange: z.enum(['5k-15k', '15k-50k', '50k-200k', '200k+']),
  companyName: z.string().optional(),
  // ... B2B-specific fields
});

// Future: General audience schema
export const GeneralFormSchema = BaseFormSchema.extend({
  eventType: z.enum(['birthday', 'graduation', 'party', 'outros']),
  budgetRange: z.enum(['1k-5k', '5k-15k', '15k-30k', '30k+']),
  // ... general-specific fields
});
```

This comprehensive form validation system provides type-safe, user-friendly forms with sophisticated lead scoring and error handling, ready for scaling to multiple audience types and use cases.