import React, { useState, useEffect } from 'react';
import { supabase } from '../../libs/supabaseClient';
import { Link } from 'react-router-dom';

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    totalProjects: 0,
    projectsByStatus: {
      not_started: 0,
      in_progress: 0,
      completed: 0,
      on_hold: 0,
      cancelled: 0
    }
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch clients statistics
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('id, status');
      
      if (clientsError) throw clientsError;

      // Fetch projects statistics
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id, status, name, deadline, clients(name)');
      
      if (projectsError) throw projectsError;

      // Calculate statistics
      const activeClients = clientsData.filter(client => client.status === 'active').length;
      
      const projectsByStatus = projectsData.reduce((acc, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1;
        return acc;
      }, {});

      // Get 5 most recent projects
      const recent = projectsData
        .sort((a, b) => new Date(b.deadline) - new Date(a.deadline))
        .slice(0, 5);

      setStats({
        totalClients: clientsData.length,
        activeClients,
        totalProjects: projectsData.length,
        projectsByStatus
      });

      setRecentProjects(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      not_started: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      on_hold: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || colors.in_progress;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Clients</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalClients}</p>
          <Link to="/dashboard/clients" className="mt-2 text-indigo-600 text-sm hover:text-indigo-800">
            View all clients →
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Active Clients</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.activeClients}</p>
          <div className="mt-2 text-sm text-gray-600">
            {((stats.activeClients / stats.totalClients) * 100).toFixed(1)}% active
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Projects</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalProjects}</p>
          <Link to="/dashboard/projects" className="mt-2 text-indigo-600 text-sm hover:text-indigo-800">
            View all projects →
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Completed Projects</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.projectsByStatus.completed || 0}</p>
          <div className="mt-2 text-sm text-gray-600">
            {((stats.projectsByStatus.completed || 0) / stats.totalProjects * 100).toFixed(1)}% completion rate
          </div>
        </div>
      </div>

      {/* Project Status Overview */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Project Status Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(stats.projectsByStatus).map(([status, count]) => (
            <div key={status} className="text-center">
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(status)}`}>
                {count}
              </div>
              <div className="mt-1 text-sm text-gray-500 capitalize">
                {status.replace('_', ' ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Projects</h3>
        <div className="space-y-4">
          {recentProjects.map((project) => (
            <div key={project.id} className="flex items-center justify-between border-b pb-4">
              <div>
                <div className="text-sm font-medium text-gray-900">{project.name}</div>
                <div className="text-sm text-gray-500">Client: {project.clients?.name}</div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  Due: {new Date(project.deadline).toLocaleDateString()}
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                  {project.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
          {recentProjects.length === 0 && (
            <div className="text-center text-gray-500">No projects found</div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/dashboard/clients"
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add New Client
          </Link>
          <Link
            to="/dashboard/projects"
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create New Project
          </Link>
        </div>
      </div>
    </div>
  );
}
