'use client';

import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useServiceTypeStore } from '@/store/useServiceTypeStore';
import { useServiceStore } from '@/store/useServiceStore';
import { useRouter } from 'next/navigation';
import { ServiceType } from '@/lib/api/serviceType';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DynamicServiceForm } from '../components/DynamicServiceForm';
import { ArrowLeft } from 'lucide-react';

export default function CreateServicePage() {
    const router = useRouter();
    const { serviceTypes, fetchServiceTypes } = useServiceTypeStore();
    const { createService, isLoading } = useServiceStore();

    const [selectedTypeId, setSelectedTypeId] = useState<string>('');
    const [selectedType, setSelectedType] = useState<ServiceType | null>(null);

    const methods = useForm({
        defaultValues: {
            name: '',
            price: 0,
            description: '',
            data: {}
        }
    });

    useEffect(() => {
        fetchServiceTypes();
    }, [fetchServiceTypes]);

    const handleTypeChange = (typeId: string) => {
        setSelectedTypeId(typeId);
        const type = serviceTypes.find(t => t._id === typeId) || null;
        setSelectedType(type);
        methods.reset({ ...methods.getValues(), data: {} }); // Reset dynamic data on type change
    };

    const onSubmit = async (data: any) => {
        if (!selectedType) return;

        const payload = {
            ...data,
            serviceTypeCode: selectedType.code,
            images: [], // Todo: Handle images
        };

        const result = await createService(payload);
        if (result) {
            router.push('/services');
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-20">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <h2 className="text-2xl font-bold">Create New Service</h2>
            </div>

            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">

                    {/* 1. Service Type Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Service Classification</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label>Service Type</Label>
                                <Select onValueChange={handleTypeChange} value={selectedTypeId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select service type..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {serviceTypes.filter(t => t.status === 'PUBLISHED').map((type) => (
                                            <SelectItem key={type._id} value={type._id}>
                                                {type.name} (v{type.version})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-sm text-gray-500">
                                    Selecting a type will load the specific fields required for that service.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {selectedType && (
                        <>
                            {/* 2. Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Basic Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Service Name</Label>
                                        <Input {...methods.register('name', { required: 'Name is required' })} placeholder="e.g. General Consultation" />
                                        {methods.formState.errors.name && <p className="text-red-500 text-xs">{methods.formState.errors.name.message as string}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea {...methods.register('description')} placeholder="Brief description of the service..." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Base Price (USD)</Label>
                                        <Input type="number" {...methods.register('price', { valueAsNumber: true, min: 0 })} />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* 3. Dynamic Fields */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>{selectedType.name} Specific Details</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <DynamicServiceForm fields={selectedType.fields} />
                                </CardContent>
                            </Card>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" size="lg" disabled={isLoading}>
                                    {isLoading ? 'Creating...' : 'Create Service'}
                                </Button>
                            </div>
                        </>
                    )}
                </form>
            </FormProvider>
        </div>
    );
}
