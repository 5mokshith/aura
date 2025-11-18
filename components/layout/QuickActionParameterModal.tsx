"use***REMOVED***client";

import***REMOVED***{***REMOVED***useState***REMOVED***}***REMOVED***from***REMOVED***"react";
import***REMOVED***{
***REMOVED******REMOVED***Dialog,
***REMOVED******REMOVED***DialogContent,
***REMOVED******REMOVED***DialogDescription,
***REMOVED******REMOVED***DialogFooter,
***REMOVED******REMOVED***DialogHeader,
***REMOVED******REMOVED***DialogTitle,
}***REMOVED***from***REMOVED***"@/components/ui/dialog";
import***REMOVED***{***REMOVED***Button***REMOVED***}***REMOVED***from***REMOVED***"@/components/ui/button";
import***REMOVED***type***REMOVED***{***REMOVED***QuickAction,***REMOVED***QuickActionParameter***REMOVED***}***REMOVED***from***REMOVED***"@/types";

interface***REMOVED***QuickActionParameterModalProps***REMOVED***{
***REMOVED******REMOVED***action:***REMOVED***QuickAction***REMOVED***|***REMOVED***null;
***REMOVED******REMOVED***open:***REMOVED***boolean;
***REMOVED******REMOVED***onClose:***REMOVED***()***REMOVED***=>***REMOVED***void;
***REMOVED******REMOVED***onSubmit:***REMOVED***(filledTemplate:***REMOVED***string)***REMOVED***=>***REMOVED***void;
}

export***REMOVED***function***REMOVED***QuickActionParameterModal({
***REMOVED******REMOVED***action,
***REMOVED******REMOVED***open,
***REMOVED******REMOVED***onClose,
***REMOVED******REMOVED***onSubmit,
}:***REMOVED***QuickActionParameterModalProps)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***[parameterValues,***REMOVED***setParameterValues]***REMOVED***=***REMOVED***useState<Record<string,***REMOVED***string>>({});

***REMOVED******REMOVED***if***REMOVED***(!action***REMOVED***||***REMOVED***!action.parameters)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***null;
***REMOVED******REMOVED***}

***REMOVED******REMOVED***const***REMOVED***handleParameterChange***REMOVED***=***REMOVED***(paramName:***REMOVED***string,***REMOVED***value:***REMOVED***string)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***setParameterValues((prev)***REMOVED***=>***REMOVED***({
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***...prev,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***[paramName]:***REMOVED***value,
***REMOVED******REMOVED******REMOVED******REMOVED***}));
***REMOVED******REMOVED***};

***REMOVED******REMOVED***const***REMOVED***handleSubmit***REMOVED***=***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Fill***REMOVED***template***REMOVED***with***REMOVED***parameter***REMOVED***values
***REMOVED******REMOVED******REMOVED******REMOVED***let***REMOVED***filledTemplate***REMOVED***=***REMOVED***action.template;
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***action.parameters?.forEach((param)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***value***REMOVED***=***REMOVED***parameterValues[param.name]***REMOVED***||***REMOVED***param.defaultValue***REMOVED***||***REMOVED***"";
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***filledTemplate***REMOVED***=***REMOVED***filledTemplate.replace(`{${param.name}}`,***REMOVED***value);
***REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED***onSubmit(filledTemplate);
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Reset***REMOVED***and***REMOVED***close
***REMOVED******REMOVED******REMOVED******REMOVED***setParameterValues({});
***REMOVED******REMOVED******REMOVED******REMOVED***onClose();
***REMOVED******REMOVED***};

***REMOVED******REMOVED***const***REMOVED***handleCancel***REMOVED***=***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***setParameterValues({});
***REMOVED******REMOVED******REMOVED******REMOVED***onClose();
***REMOVED******REMOVED***};

***REMOVED******REMOVED***const***REMOVED***isValid***REMOVED***=***REMOVED***action.parameters.every((param)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!param.required)***REMOVED***return***REMOVED***true;
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***value***REMOVED***=***REMOVED***parameterValues[param.name]***REMOVED***||***REMOVED***param.defaultValue;
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***value***REMOVED***&&***REMOVED***value.trim().length***REMOVED***>***REMOVED***0;
***REMOVED******REMOVED***});

***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<Dialog***REMOVED***open={open}***REMOVED***onOpenChange={(isOpen)***REMOVED***=>***REMOVED***!isOpen***REMOVED***&&***REMOVED***handleCancel()}>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<DialogContent***REMOVED***aria-describedby="parameter-modal-description">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<DialogHeader>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<DialogTitle>{action.title}</DialogTitle>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<DialogDescription***REMOVED***id="parameter-modal-description">{action.description}</DialogDescription>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</DialogHeader>

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="space-y-4***REMOVED***py-4">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{action.parameters.map((param)***REMOVED***=>***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***key={param.name}***REMOVED***className="space-y-2">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<label
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***htmlFor={param.name}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="text-sm***REMOVED***font-medium***REMOVED***leading-none***REMOVED***peer-disabled:cursor-not-allowed***REMOVED***peer-disabled:opacity-70"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{param.label}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{param.required***REMOVED***&&***REMOVED***<span***REMOVED***className="text-red-500***REMOVED***ml-1">*</span>}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</label>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***id={param.name}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***name={param.name}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***type={param.type}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***placeholder={param.placeholder}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***defaultValue={param.defaultValue}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***value={parameterValues[param.name]***REMOVED***??***REMOVED***param.defaultValue***REMOVED***??***REMOVED***""}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onChange={(e)***REMOVED***=>***REMOVED***handleParameterChange(param.name,***REMOVED***e.target.value)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="flex***REMOVED***h-10***REMOVED***w-full***REMOVED***rounded-md***REMOVED***border***REMOVED***border-input***REMOVED***bg-background***REMOVED***px-3***REMOVED***py-2***REMOVED***text-sm***REMOVED***ring-offset-background***REMOVED***file:border-0***REMOVED***file:bg-transparent***REMOVED***file:text-sm***REMOVED***file:font-medium***REMOVED***placeholder:text-muted-foreground***REMOVED***focus-visible:outline-none***REMOVED***focus-visible:ring-2***REMOVED***focus-visible:ring-ring***REMOVED***focus-visible:ring-offset-2***REMOVED***disabled:cursor-not-allowed***REMOVED***disabled:opacity-50"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***required={param.required}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<DialogFooter>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<Button***REMOVED***variant="outline"***REMOVED***onClick={handleCancel}>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Cancel
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</Button>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<Button***REMOVED***onClick={handleSubmit}***REMOVED***disabled={!isValid}>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Use***REMOVED***Action
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</Button>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</DialogFooter>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</DialogContent>
***REMOVED******REMOVED******REMOVED******REMOVED***</Dialog>
***REMOVED******REMOVED***);
}
