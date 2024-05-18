import Sidebar from './api/react_components/sidebar_medico';

const DashboardMedico = () => {
  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="flex flex-col w-full">
        <h1 className="text-black text-3xl font-bold mb-6 text-center">
          Dashboard Médico
        </h1>
      </div>
    </div>
  );
};

export default DashboardMedico;
