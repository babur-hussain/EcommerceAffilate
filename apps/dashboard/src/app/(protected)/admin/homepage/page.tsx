'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { HomepageConfig, HomepageSection } from '@/types';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { GripVertical, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminHomepagePage() {
  const { user } = useAuth();
  const [config, setConfig] = useState<HomepageConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(null);

  useEffect(() => {
    fetchHomepageConfig();
  }, []);

  const fetchHomepageConfig = async () => {
    try {
      const response = await apiClient.get<HomepageConfig>('/api/admin/homepage/config');
      setConfig(response.data);
    } catch (error) {
      console.error('Failed to fetch homepage config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || !config) return;

    const items = Array.from(config.sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order values
    const updatedSections = items.map((section, index) => ({
      ...section,
      order: index,
    }));

    setConfig({ ...config, sections: updatedSections });

    try {
      await apiClient.put('/api/admin/homepage/config/reorder', {
        sections: updatedSections,
      });
      toast.success('Section order updated');
    } catch (error) {
      console.error('Failed to reorder sections:', error);
      toast.error('Failed to update order');
      fetchHomepageConfig();
    }
  };

  const toggleSectionEnabled = async (sectionId: string, enabled: boolean) => {
    try {
      await apiClient.patch(`/api/admin/homepage/sections/${sectionId}`, { enabled });
      toast.success(`Section ${enabled ? 'enabled' : 'disabled'}`);
      fetchHomepageConfig();
    } catch (error) {
      console.error('Failed to toggle section:', error);
      toast.error('Failed to update section');
    }
  };

  const deleteSection = async (sectionId: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;

    try {
      await apiClient.delete(`/api/admin/homepage/sections/${sectionId}`);
      toast.success('Section deleted');
      fetchHomepageConfig();
    } catch (error) {
      console.error('Failed to delete section:', error);
      toast.error('Failed to delete section');
    }
  };

  if (!user) return null;

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Homepage CMS</h1>
              <p className="text-gray-600 mt-1">Manage homepage sections and layout</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Section
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : config ? (
            <div className="bg-white rounded-lg shadow">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sections">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {config.sections
                        .sort((a, b) => a.order - b.order)
                        .map((section, index) => (
                          <Draggable
                            key={section._id || index}
                            draggableId={section._id || `section-${index}`}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="border-b border-gray-200 last:border-b-0"
                              >
                                <div className="p-6 flex items-center space-x-4">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="cursor-grab active:cursor-grabbing"
                                  >
                                    <GripVertical className="h-5 w-5 text-gray-400" />
                                  </div>

                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <h3 className="text-lg font-medium text-gray-900">
                                        {section.title}
                                      </h3>
                                      <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                                        {section.type}
                                      </span>
                                      {section.enabled ? (
                                        <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                                          Enabled
                                        </span>
                                      ) : (
                                        <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700">
                                          Disabled
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                      Order: {section.order}
                                    </p>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() =>
                                        toggleSectionEnabled(
                                          section._id!,
                                          !section.enabled
                                        )
                                      }
                                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                      title={section.enabled ? 'Disable' : 'Enable'}
                                    >
                                      {section.enabled ? (
                                        <EyeOff className="h-5 w-5" />
                                      ) : (
                                        <Eye className="h-5 w-5" />
                                      )}
                                    </button>
                                    <button
                                      onClick={() => setEditingSection(section)}
                                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                      title="Edit"
                                    >
                                      <Edit className="h-5 w-5" />
                                    </button>
                                    <button
                                      onClick={() => deleteSection(section._id!)}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                      title="Delete"
                                    >
                                      <Trash2 className="h-5 w-5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {config.sections.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No sections configured. Add your first section.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Failed to load homepage configuration</p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
