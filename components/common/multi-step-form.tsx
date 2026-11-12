"use client"

import { useState } from "react"
import { FieldValues, UseFormReturn } from "react-hook-form"
import { ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { cn } from "@/lib/utils"

type Props<T extends FieldValues> = {
  "title":string,
  "description":string,
  "steps":{
    // "title":string,
    // "description":string,
    "header":string,
    "component":React.ReactNode,
    "fieldsToValidate":string[],
  }[],
  form:UseFormReturn<T>,
  onSubmit:(values:T)=>void,
  isSubmitting:boolean,
  showProgressSteps?:boolean,
  submitButtonText?:string,
  className?:string,
}

export function MultiStepFrom<T extends FieldValues>({className,submitButtonText,steps,form,isSubmitting,onSubmit,showProgressSteps=true,title,description}:Props<T>) {
  const [activeStep, setActiveStep] = useState(0)

  // Handle next step
  const handleNext = async () => {
    const fieldsToValidate = steps[activeStep].fieldsToValidate

    const result = await form.trigger(fieldsToValidate as any, { shouldFocus: true })
    if (result) {
      setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))
      window.scrollTo(0, 0)
    }
  }

  // Handle previous step
  const handlePrevious = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0))
  }


  return (
    <div className={cn("min-h-screen bg-muted/30 py-10",className)}>
      <div className="container max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
          <p className="mt-4 text-muted-foreground">
            {description}
          </p>
        </div>


        <div className="w-full max-w-4xl mx-auto">
          {/* Progress Steps */}
          {
            showProgressSteps
            &&
            <div className="mb-8">
              <div className="hidden sm:flex justify-between">
                {steps.map((step, index) => (
                  <div
                    key={step.header+index}
                    className={`flex flex-col items-center ${index <= activeStep ? "text-primary" : "text-muted-foreground"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                        index < activeStep
                          ? "bg-primary text-primary-foreground"
                          : index === activeStep
                            ? "border-2 border-primary text-primary"
                            : "border-2 border-muted-foreground text-muted-foreground"
                      }`}
                    >
                      {index < activeStep ? <ChevronRight className="h-4 w-4" /> : index + 1}
                    </div>
                    <span className="text-xs font-medium">{step.header}</span>
                  </div>
                ))}
              </div>

              {/* Mobile Progress Indicator */}
              <div className="sm:hidden flex items-center justify-between mb-4">
                <Button variant="ghost" size="sm" onClick={handlePrevious} disabled={isSubmitting || activeStep === 0}>
                  Back
                </Button>
                <span className="text-sm font-medium">
                  Step {activeStep + 1} of {steps.length}: {steps[activeStep].header}
                </span>
                {activeStep < steps.length - 1 ? (
                  <Button type="button" disabled={isSubmitting} variant="ghost" size="sm" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button disabled={isSubmitting} type="submit" variant="ghost" size="sm">
                    Submit
                  </Button>
                )}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-muted h-2 rounded-full mt-4">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          }

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit,(err)=>console.log(err))} className="space-y-8">
              {steps[activeStep].component}
              {/* Navigation Buttons */}
              <div className="flex justify-between">
                {
                  steps.length > 1
                  &&
                  <Button type="button" variant="outline" onClick={handlePrevious} disabled={isSubmitting || activeStep === 0}>
                    Previous
                  </Button>
                }
                <Button className={cn(activeStep < steps.length - 1 ? "block" : "hidden")} disabled={isSubmitting} type="button" onClick={handleNext}>
                  Next
                </Button>
                <Button 
                  disabled={isSubmitting} 
                  type="submit"
                  className={cn(steps.length === 1 && "w-full",activeStep === steps.length - 1 ? "block" : "hidden")}
                >
                  {submitButtonText ?? "Submit Registration"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}