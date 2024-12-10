import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

interface UserData {
  name: string;
  company?: string;
  roles: string[];
}

const OpdrachtgeverDashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('user_role');
    if (userRole !== 'opdrachtgever') {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('wp_token');
        const response = await fetch('https://www.facilitairebedrijven.nl/wp-json/wp/v2/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigatie */}
      <nav className="bg-fb-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img
                className="h-8 w-auto"
                src="/fb-logo.png"
                alt="Facilitaire Bedrijven"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="h-6 w-6" />
              </button>
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <UserCircleIcon className="h-8 w-8" />
                </label>
                <ul tabIndex={0} className="menu dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                  <li><a>Profiel</a></li>
                  <li><a>Instellingen</a></li>
                  <li><a onClick={() => {
                    localStorage.clear();
                    navigate('/login');
                  }}>Uitloggen</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Welkom kaart */}
          <div className="col-span-3 bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Welkom terug, {userData?.name}
            </h1>
            <p className="mt-1 text-gray-600">
              Opdrachtgever Dashboard
            </p>
          </div>

          {/* Statistieken */}
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Openstaande Aanvragen</div>
              <div className="stat-value">3</div>
              <div className="stat-desc">↗︎ 1 (33%)</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Actieve Projecten</div>
              <div className="stat-value">5</div>
              <div className="stat-desc">↗︎ 2 (40%)</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Ontvangen Offertes</div>
              <div className="stat-value">8</div>
              <div className="stat-desc">↗︎ 4 (50%)</div>
            </div>
          </div>

          {/* Recent overzicht */}
          <div className="col-span-3 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recente Aanvragen</h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Status</th>
                    <th>Aantal Offertes</th>
                    <th>Actie</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Schoonmaak Hoofdkantoor</td>
                    <td><span className="badge badge-warning">Wacht op offertes</span></td>
                    <td>3</td>
                    <td><button className="btn btn-sm">Bekijk</button></td>
                  </tr>
                  <tr>
                    <td>Catering Events 2024</td>
                    <td><span className="badge badge-success">Offertes ontvangen</span></td>
                    <td>5</td>
                    <td><button className="btn btn-sm">Bekijk</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpdrachtgeverDashboard; 