import React, { useState, useEffect } from 'react';
import { supabase } from '../../libs/supabaseClient';
import { Modal, Button, TextInput, Select, Textarea } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { DatePicker } from '@mantine/dates';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    client_id: '',
    status: 'not_started',
    deadline: new Date()
  });

  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name')
        .eq('status', 'active');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error.message);
      showNotification({
        title: 'Error',
        message: 'Failed to fetch clients. Please try again.',
        color: 'red'
      });
    }
  };

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          clients (
            name,
            company
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error.message);
      showNotification({
        title: 'Error',
        message: 'Failed to fetch projects. Please try again.',
        color: 'red'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!newProject.name.trim()) errors.name = 'Project name is required';
    if (!newProject.description.trim()) errors.description = 'Description is required';
    if (!newProject.client_id) errors.client_id = 'Please select a client';
    if (!newProject.deadline) errors.deadline = 'Deadline is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddProject = async () => {
    if (!validateForm()) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            name: newProject.name.trim(),
            description: newProject.description.trim(),
            client_id: newProject.client_id,
            status: newProject.status,
            deadline: newProject.deadline
          }
        ])
        .select(`
          *,
          clients (
            name,
            company
          )
        `);

      if (error) throw error;

      setProjects([data[0], ...projects]);
      setModalOpen(false);
      setNewProject({
        name: '',
        description: '',
        client_id: '',
        status: 'not_started',
        deadline: new Date()
      });
      showNotification({
        title: 'Success',
        message: 'Project added successfully!',
        color: 'green'
      });
    } catch (error) {
      console.error('Error adding project:', error.message);
      showNotification({
        title: 'Error',
        message: 'Failed to add project. Please try again.',
        color: 'red'
      });
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setProjects(projects.filter(project => project.id !== id));
        showNotification({
          title: 'Success',
          message: 'Project deleted successfully!',
          color: 'green'
        });
      } catch (error) {
        console.error('Error deleting project:', error.message);
        showNotification({
          title: 'Error',
          message: 'Failed to delete project. Please try again.',
          color: 'red'
        });
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      not_started: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      on_hold: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800'
    };
    return colors[status] || colors.not_started;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Project Management</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add New Project
        </button>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">{project.name}</h3>
              <button
                onClick={() => handleDeleteProject(project.id)}
                className="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </div>
            <p className="text-gray-600 text-sm mt-2">{project.description}</p>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Client: {project.clients?.name} ({project.clients?.company})
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Deadline: {new Date(project.deadline).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-4">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                {project.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="text-center py-4">
          Loading projects...
        </div>
      )}

      {!isLoading && projects.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No projects found. Add your first project!
        </div>
      )}

      {/* Add Project Modal */}
      <Modal
        opened={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setFormErrors({});
          setNewProject({
            name: '',
            description: '',
            client_id: '',
            status: 'not_started',
            deadline: new Date()
          });
        }}
        title="Add New Project"
      >
        <div className="space-y-4">
          <TextInput
            required
            label="Project Name"
            placeholder="Enter project name"
            value={newProject.name}
            onChange={(event) => setNewProject({ ...newProject, name: event.currentTarget.value })}
            error={formErrors.name}
          />
          <Textarea
            required
            label="Description"
            placeholder="Enter project description"
            value={newProject.description}
            onChange={(event) => setNewProject({ ...newProject, description: event.currentTarget.value })}
            error={formErrors.description}
            minRows={3}
          />
          <Select
            required
            label="Client"
            placeholder="Select client"
            value={newProject.client_id}
            onChange={(value) => setNewProject({ ...newProject, client_id: value })}
            data={clients.map(client => ({
              value: client.id,
              label: `${client.name}`
            }))}
            error={formErrors.client_id}
          />
          <Select
            label="Status"
            placeholder="Select project status"
            value={newProject.status}
            onChange={(value) => setNewProject({ ...newProject, status: value })}
            data={[
              { value: 'not_started', label: 'Not Started' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'on_hold', label: 'On Hold' },
              { value: 'completed', label: 'Completed' }
            ]}
          />
          <DatePicker
            required
            label="Deadline"
            placeholder="Pick deadline"
            value={newProject.deadline}
            onChange={(value) => setNewProject({ ...newProject, deadline: value })}
            error={formErrors.deadline}
          />
          <Button fullWidth onClick={handleAddProject}>
            Add Project
          </Button>
        </div>
      </Modal>
    </div>
  );
}
