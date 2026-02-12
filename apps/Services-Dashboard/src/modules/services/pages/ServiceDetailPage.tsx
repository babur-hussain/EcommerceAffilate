'use client';

import React, { useEffect, useState } from 'react';
import { useServiceStore } from '@/store/useServiceStore';
import { useServiceTypeStore } from '@/store/useServiceTypeStore';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Save, Trash2, Eye } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { DynamicServiceForm } from '../components/DynamicServiceForm';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ServiceDetailPage() {
    const router = useRouter();
    const params = useParams();
    const {
        currentService,
        fetchServiceById,
        updateService,
        deleteService,
        isLoading
    } = useServiceStore();

    const { fetchServiceTypeByCode, currentServiceType } = useServiceTypeStore();
    const [isEditing, setIsEditing] = useState(false);

    const methods = useForm();

    useEffect(() => {
        if (params.id) {
            fetchServiceById(params.id as string);
        }
    }, [params.id, fetchServiceById]);

    useEffect(() => {
        if (currentService) {
            // Fetch the specific version of schema used by this service
            fetchServiceTypeByCode(
                currentService.serviceTypeCode,
                undefined,
                currentService.serviceTypeVersion
            );
            methods.reset({
                name: currentService.name,
                description: currentService.description,
                price: currentService.price,
                data: currentService.data
            });
        }
    }, [currentService, fetchServiceTypeByCode, methods.reset]);

    const handleSave = async (data: any) => {
        if (currentService) {
            await updateService(currentService._id, data);
            setIsEditing(false);
        }
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to archive this service?')) {
            if (currentService) {
                await deleteService(currentService._id);
                router.push('/services');
            }
        }
    };

    if (isLoading || !currentService) return <div>Loading Service...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => router.push('/services')}>
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold">{currentService.name}</h2>
                        <div className="flex gap-2 text-sm text-gray-500">
                            <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">
                                {currentService.serviceTypeCode} v{currentService.serviceTypeVersion}
                            </span>
                            <span className={`${currentService.status === 'ACTIVE' ? 'text-green-600' : 'text-orange-600'
                                }`}>
                                {currentService.status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    {!isEditing ? (
                        <>
                            <Button variant="outline" onClick={() => setIsEditing(true)}>
                                <Edit className="h-4 w-4 mr-2" /> Edit Service
                            </Button>
                            <Button variant="destructive" size="icon" onClick={handleDelete}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button onClick={methods.handleSubmit(handleSave)}>
                                <Save className="h-4 w-4 mr-2" /> Save Changes
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <Tabs defaultValue="details" className="w-full">
                <TabsList>
                    <TabsTrigger value="details">Service Details</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="audit">Audit Logs</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6 mt-4">

                    {/* Main Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>General Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input {...methods.register('name')} disabled={!isEditing} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Price (USD)</Label>
                                    <Input type="number" {...methods.register('price', { valueAsNumber: true })} disabled={!isEditing} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea rows={3} {...methods.register('description')} disabled={!isEditing} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dynamic Data */}
                    {currentServiceType && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Service Specifics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FormProvider {...methods}>
                                    {/* TODO: Pass readOnly flag to DynamicServiceForm if not editing */}
                                    <fieldset disabled={!isEditing} className="space-y-4">
                                        <DynamicServiceForm fields={currentServiceType.fields} />
                                    </fieldset>
                                </FormProvider>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="preview">
                    <div className="p-10 border border-dashed rounded bg-gray-50 text-center text-gray-400">
                        Service Preview Component typically goes here (Mobile view mockup)
                    </div>
                </TabsContent>

                <TabsContent value="audit">
                    <div className="p-10 border border-dashed rounded bg-gray-50 text-center text-gray-400">
                        Audit Logs for this service
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
