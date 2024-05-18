import SidebarPaciente from './api/react_components/sidebar_paciente';

const DashboardMedico = () => {
  return (
    <div className="flex flex-row">
      <SidebarPaciente />
      <div className="flex flex-col w-full">
        <h1 className="text-black text-3xl font-bold mb-6 text-center">
          Dashboard Paciente
        </h1>
      </div>
    </div>
  );
};

export default DashboardMedico;
