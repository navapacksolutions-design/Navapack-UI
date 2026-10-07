
import React, { useMemo, useState } from "react";
import navapackLogo from "../assets/Nava-logo.png";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarDays,
  BriefcaseBusiness,
  BarChart3,
  Search,
  Menu,
  X,
  LogOut,
  UserPlus,
  UserCheck,
  Clock,
  ClipboardList,
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  position: string;
  status: "Active" | "Inactive";
}

interface LeaveRequest {
  id: string;
  employee: string;
  leaveType: string;
  from: string;
  to: string;
  status: "Pending" | "Approved" | "Rejected";
}

const demoEmployees: Employee[] = [
  {
    id: "1",
    name: "John Doe",
    employeeId: "EMP-001",
    department: "Sales",
    position: "Sales Representative",
    status: "Active",
  },
  {
    id: "2",
    name: "Mary Smith",
    employeeId: "EMP-002",
    department: "Marketing",
    position: "Marketing Executive",
    status: "Active",
  },
  {
    id: "3",
    name: "David Lee",
    employeeId: "EMP-003",
    department: "Production",
    position: "Production Operator",
    status: "Active",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    employeeId: "EMP-004",
    department: "Finance",
    position: "Accountant",
    status: "Active",
  },
];

const demoLeaveRequests: LeaveRequest[] = [
  {
    id: "1",
    employee: "John Doe",
    leaveType: "Annual Leave",
    from: "01 Oct 2026",
    to: "03 Oct 2026",
    status: "Pending",
  },
  {
    id: "2",
    employee: "Mary Smith",
    leaveType: "Sick Leave",
    from: "02 Oct 2026",
    to: "02 Oct 2026",
    status: "Approved",
  },
  {
    id: "3",
    employee: "David Lee",
    leaveType: "Annual Leave",
    from: "05 Oct 2026",
    to: "07 Oct 2026",
    status: "Pending",
  },
];

export const HRDashboard: React.FC = () => {
 const [activeTab, setActiveTab] = useState<
  | "dashboard"
  | "employees"
  | "attendance"
  | "leave"
  | "recruitment"
  | "hr-department"
  | "reports"
>("dashboard");
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  const filteredEmployees = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return demoEmployees;
    }

    return demoEmployees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(query) ||
        employee.employeeId.toLowerCase().includes(query) ||
        employee.department.toLowerCase().includes(query) ||
        employee.position.toLowerCase().includes(query)
    );
  }, [search]);

  const handleLogout = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      {/* MOBILE OVERLAY */}
      {mobileMenu && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          h-screen
          overflow-y-auto
          w-72
          border-r
          border-slate-200
          bg-white
          transition-transform
          duration-300
          lg:translate-x-0
          ${
            mobileMenu
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* LOGO / TITLE */}
       <div className="relative flex h-36 flex-col items-center justify-center border-b px-6">
  <img
    src={navapackLogo}
    alt="Navapack"
    className="mb-2 h-12 w-auto object-contain"
  />

  <h1 className="text-lg font-bold text-slate-900">
    HR Dashboard
  </h1>

  <p className="text-xs text-slate-500">
    Human Resources Panel
  </p>

  <button
    className="absolute right-4 top-4 lg:hidden"
    onClick={() => setMobileMenu(false)}
  >
    <X size={22} />
  </button>
</div>

        {/* NAVIGATION */}
        <nav className="space-y-2 p-4">
          <SidebarButton
            active={activeTab === "dashboard"}
            icon={<LayoutDashboard size={19} />}
            label="Dashboard"
            onClick={() => {
              setActiveTab("dashboard");
              setMobileMenu(false);
            }}
          />

          <SidebarButton
            active={activeTab === "employees"}
            icon={<Users size={19} />}
            label="Employees"
            onClick={() => {
              setActiveTab("employees");
              setMobileMenu(false);
            }}
          />

          <SidebarButton
            active={activeTab === "attendance"}
            icon={<CalendarCheck size={19} />}
            label="Attendance"
            onClick={() => {
              setActiveTab("attendance");
              setMobileMenu(false);
            }}
          />

          <SidebarButton
            active={activeTab === "leave"}
            icon={<CalendarDays size={19} />}
            label="Leave Management"
            onClick={() => {
              setActiveTab("leave");
              setMobileMenu(false);
            }}
          />

          <SidebarButton
            active={activeTab === "recruitment"}
            icon={<BriefcaseBusiness size={19} />}
            label="Recruitment"
            onClick={() => {
              setActiveTab("recruitment");
              setMobileMenu(false);
            }}
          />
          <SidebarButton
  active={activeTab === "hr-department"}
  icon={<Users size={19} />}
  label="HR Department"
  onClick={() => {
    setActiveTab("hr-department");
    setMobileMenu(false);
  }}
/>

          <SidebarButton
            active={activeTab === "reports"}
            icon={<BarChart3 size={19} />}
            label="Reports"
            onClick={() => {
              setActiveTab("reports");
              setMobileMenu(false);
            }}
          />
        </nav>

        {/* USER */}
        <div className="mt-auto w-full border-t p-4">
          <div className="mb-3 rounded-xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">
              HR User
            </p>

            <p className="text-xs text-slate-500">
              hr@navapack.com
            </p>

            <span className="mt-2 inline-block rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
              HR Department
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="lg:pl-72">
        {/* TOPBAR */}
        <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-slate-200 bg-white px-4 sm:px-6">
          <button
            className="lg:hidden"
            onClick={() => setMobileMenu(true)}
          >
            <Menu size={24} />
          </button>

          <div className="relative max-w-xl flex-1">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employees..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
            />
          </div>

          <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
            HR
          </div>
        </header>

        {/* CONTENT */}
        <main className="p-4 sm:p-6 lg:p-8">
          {activeTab === "dashboard" && (
            <HRDashboardHome
              employees={demoEmployees}
              leaveRequests={demoLeaveRequests}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "employees" && (
            <EmployeesSection employees={filteredEmployees} />
          )}

          {activeTab === "attendance" && <AttendanceSection />}

          {activeTab === "leave" && (
            <LeaveSection leaveRequests={demoLeaveRequests} />
          )}

          {activeTab === "recruitment" && <RecruitmentSection />}

          {activeTab === "hr-department" && <HRDepartmentSection />}

          {activeTab === "reports" && <ReportsSection />}
        </main>
      </div>
    </div>
  );
};

// =====================================================
// SIDEBAR BUTTON
// =====================================================

const SidebarButton = ({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex
        w-full
        items-center
        gap-3
        rounded-xl
        px-4
        py-3
        text-sm
        font-medium
        transition
        ${
          active
            
             ? "bg-sky-600 text-white shadow-sm"
             : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
};

// =====================================================
// HR DASHBOARD HOME
// =====================================================

const HRDashboardHome = ({
  employees,
  leaveRequests,
  setActiveTab,
}: {
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  setActiveTab: (
    tab:
      | "dashboard"
      | "employees"
      | "attendance"
      | "leave"
      | "recruitment"
      | "reports"
  ) => void;
}) => {
  const pendingLeaves = leaveRequests.filter(
    (request) => request.status === "Pending"
  ).length;

  const activeEmployees = employees.filter(
    (employee) => employee.status === "Active"
  ).length;

  return (
    <div className="space-y-8">
      {/* PAGE TITLE */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          HR Overview
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Manage employees, attendance, leave and recruitment.
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={employees.length}
          icon={<Users size={22} />}
          description="Registered employees"
        />

        <StatCard
          title="Present Today"
          value={38}
          icon={<UserCheck size={22} />}
          description="Employees present"
        />

        <StatCard
          title="On Leave"
          value={4}
          icon={<CalendarDays size={22} />}
          description="Currently on leave"
        />

        <StatCard
          title="Pending Requests"
          value={pendingLeaves}
          icon={<Clock size={22} />}
          description="Awaiting HR action"
        />
      </div>

      {/* QUICK ACTIONS */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Quick Actions
        </h2>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <QuickAction
            icon={<UserPlus size={21} />}
            title="Add Employee"
            description="Register a new employee"
            onClick={() => setActiveTab("employees")}
          />

          <QuickAction
            icon={<Users size={21} />}
            title="Manage Employees"
            description="View employee records"
            onClick={() => setActiveTab("employees")}
          />

          <QuickAction
            icon={<CalendarDays size={21} />}
            title="Leave Requests"
            description="Review employee leave"
            onClick={() => setActiveTab("leave")}
          />

          <QuickAction
            icon={<CalendarCheck size={21} />}
            title="Attendance"
            description="View attendance records"
            onClick={() => setActiveTab("attendance")}
          />
        </div>
      </div>

      {/* RECENT EMPLOYEES */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2 className="font-semibold text-slate-900">
              Recent Employees
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Recently registered employees
            </p>
          </div>

          <button
            onClick={() => setActiveTab("employees")}
            className="text-sm font-medium text-slate-900 hover:underline"
          >
            View all
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Employee ID</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Position</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {employees.slice(0, 4).map((employee) => (
                <tr key={employee.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-medium text-slate-900">
                    {employee.name}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {employee.employeeId}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {employee.department}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {employee.position}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                      {employee.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* LEAVE REQUESTS */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2 className="font-semibold text-slate-900">
              Recent Leave Requests
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Latest employee leave requests
            </p>
          </div>

          <button
            onClick={() => setActiveTab("leave")}
            className="text-sm font-medium text-slate-900 hover:underline"
          >
            View all
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Leave Type</th>
                <th className="px-5 py-3">From</th>
                <th className="px-5 py-3">To</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {leaveRequests.map((request) => (
                <tr key={request.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-medium text-slate-900">
                    {request.employee}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {request.leaveType}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {request.from}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {request.to}
                  </td>

                  <td className="px-5 py-4">
                    <LeaveStatus status={request.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// EMPLOYEES
// =====================================================

const EmployeesSection = ({
  employees,
}: {
  employees: Employee[];
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Employees
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          View and manage employee information.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h3 className="font-semibold text-slate-900">
              Employee Directory
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              All registered employees
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800">
            <UserPlus size={17} />
            Add Employee
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Employee ID</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Position</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-medium text-slate-900">
                    {employee.name}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {employee.employeeId}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {employee.department}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {employee.position}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                      {employee.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// ATTENDANCE
// =====================================================

const AttendanceSection = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Attendance
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Monitor employee attendance.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Present"
          value={38}
          icon={<UserCheck size={22} />}
          description="Today"
        />

        <StatCard
          title="Absent"
          value={3}
          icon={<Users size={22} />}
          description="Today"
        />

        <StatCard
          title="Late"
          value={4}
          icon={<Clock size={22} />}
          description="Today"
        />

        <StatCard
          title="On Leave"
          value={4}
          icon={<CalendarDays size={22} />}
          description="Today"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <CalendarCheck
            size={22}
            className="text-slate-700"
          />

          <div>
            <h3 className="font-semibold text-slate-900">
              Today's Attendance
            </h3>

            <p className="text-xs text-slate-500">
              Attendance records will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// LEAVE
// =====================================================

const LeaveSection = ({
  leaveRequests,
}: {
  leaveRequests: LeaveRequest[];
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Leave Management
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Review and manage employee leave requests.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <h3 className="font-semibold text-slate-900">
            Leave Requests
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Employee leave applications
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Leave Type</th>
                <th className="px-5 py-3">From</th>
                <th className="px-5 py-3">To</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {leaveRequests.map((request) => (
                <tr key={request.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-medium text-slate-900">
                    {request.employee}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {request.leaveType}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {request.from}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {request.to}
                  </td>

                  <td className="px-5 py-4">
                    <LeaveStatus status={request.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// RECRUITMENT
// =====================================================

const RecruitmentSection = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Recruitment
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Manage recruitment and hiring activities.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Open Positions"
          value={5}
          icon={<BriefcaseBusiness size={22} />}
          description="Currently open"
        />

        <StatCard
          title="Applications"
          value={24}
          icon={<ClipboardList size={22} />}
          description="Received"
        />

        <StatCard
          title="Interviews"
          value={8}
          icon={<Users size={22} />}
          description="Scheduled"
        />

        <StatCard
          title="Hired"
          value={3}
          icon={<UserCheck size={22} />}
          description="This month"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">
          Recruitment Overview
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Recruitment information will appear here.
        </p>
      </div>
    </div>
  );
};
// =====================================================
// HR DEPARTMENT
// =====================================================

const HRDepartmentSection = () => {
  const hrTeam = [
    {
      name: "Sarah Johnson",
      position: "HR Manager",
      status: "Active",
    },
    {
      name: "Michael Brown",
      position: "HR Executive",
      status: "Active",
    },
    {
      name: "Emily Davis",
      position: "HR Coordinator",
      status: "Active",
    },
    {
      name: "Daniel Wilson",
      position: "Recruitment Officer",
      status: "Active",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          HR Department
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Manage HR department information and activities.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Employees</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">42</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Active Employees</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">39</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">On Leave</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">3</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Open Positions</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">5</p>
        </div>
      </div>

      {/* HR Team */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900">
            HR Team
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            HR department team members.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {hrTeam.map((member) => (
            <div
              key={member.name}
              className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-slate-900">
                  {member.name}
                </p>

                <p className="text-sm text-slate-500">
                  {member.position}
                </p>
              </div>

              <span className="w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                {member.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent HR Activities */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900">
            Recent HR Activities
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Recent activities handled by the HR department.
          </p>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-slate-400" />
            <p className="text-sm text-slate-600">
              New employee onboarding completed.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-slate-400" />
            <p className="text-sm text-slate-600">
              Annual leave requests reviewed.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-slate-400" />
            <p className="text-sm text-slate-600">
              Recruitment interview scheduled.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-slate-400" />
            <p className="text-sm text-slate-600">
              Employee records updated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
// =====================================================
// REPORTS
// =====================================================

const ReportsSection = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          HR Reports
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          View HR-related reports and summaries.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <ReportCard
          icon={<Users size={22} />}
          title="Employee Report"
          description="Employee information and department summary."
        />

        <ReportCard
          icon={<CalendarCheck size={22} />}
          title="Attendance Report"
          description="Attendance and absence summary."
        />

        <ReportCard
          icon={<CalendarDays size={22} />}
          title="Leave Report"
          description="Employee leave summary."
        />
      </div>
    </div>
  );
};

// =====================================================
// STAT CARD
// =====================================================

const StatCard = ({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
          {icon}
        </div>
      </div>

      <p className="mt-5 text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-3xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
};

// =====================================================
// QUICK ACTION
// =====================================================

const QuickAction = ({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
        {icon}
      </div>

      <div>
        <p className="font-semibold text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </button>
  );
};

// =====================================================
// LEAVE STATUS
// =====================================================

const LeaveStatus = ({
  status,
}: {
  status: LeaveRequest["status"];
}) => {
  const classes = {
    Pending: "bg-amber-100 text-amber-700",
    Approved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${classes[status]}`}
    >
      {status}
    </span>
  );
};

// =====================================================
// REPORT CARD
// =====================================================

const ReportCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <button className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
        {icon}
      </div>

      <h3 className="mt-4 font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </button>
  );
};

