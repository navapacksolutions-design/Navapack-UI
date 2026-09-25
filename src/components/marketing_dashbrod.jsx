import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart3, Users, Calendar, FileText, List, Search, Plus, Eye, Edit2, Trash2, 
  Filter, Download, AlertCircle, CheckCircle2, Clock, XCircle, ChevronDown, 
  Building2, Phone, MapPin, DollarSign, Package, ShieldAlert, CheckSquare, RefreshCw, Layers, LogOut
} from 'lucide-react';

const INITIAL_SALESPERSONS = ['Pouline Bwogi', 'Rogers Wandera', 'Haidare Karrar', 'Salesperson 4'];
const INITIAL_SALES_STAGES = [
  'New Lead', 'Requirement Identified', 'Sample Requested', 'Quotation Sent', 
  'Negotiation', 'Order Won', 'Order Lost', 'On Hold'
];
const INITIAL_CUSTOMER_TYPES = ['Manufacturer', 'Wholesaler', 'Retailer', 'Corporate', 'Government', 'Distributor'];
const INITIAL_DEPTS = ['Sales', 'Production', 'Quality Control', 'Accounts/Finance', 'Logistics/Dispatch', 'Management'];
const INITIAL_ISSUE_STATUSES = ['Pending', 'On Hold', 'Resolved'];
const INITIAL_PRODUCTS = [
  'Customized Printed Polythene Bags', 'Plain HDPE Bags', 'LDPE Packaging Rolls', 
  'Biodegradable Carrier Bags', 'Industrial Shrink Wrap'
];

const PIPELINE_API_URL = 'https://api.navapacksolutions.com/api/pipeline/';
const ACTIVITY_API_URL = 'https://api.navapacksolutions.com/api/daily-activities/';
const SALESPERSON_API_URL = 'https://api.navapacksolutions.com/api/salespersons/';
const DASHBOARD_METRICS_API_URL = 'https://api.navapacksolutions.com/api/dashboard-metrics/';
const REPORTS_API_URL = 'https://api.navapacksolutions.com/api/reports/';

const normalizeSalespersonApiPayload = (form) => ({
  name: form.name || '',
  email: form.email || '',
  phone: form.phone || '',
  department: form.department || 'Sales',
  is_active: Boolean(form.is_active)
});

const normalizeSalespersonRecord = (item, fallbackId = null) => ({
  id: item?.id ?? fallbackId,
  name: item?.name || '',
  email: item?.email || '',
  phone: item?.phone || '',
  department: item?.department || 'Sales',
  is_active: item?.is_active ?? true,
  created_at: item?.created_at || ''
});

const normalizeStatusLabel = (value) => {
  if (!value) return 'Pending';
  const text = String(value).trim();
  const mapping = {
    PENDING: 'Pending',
    OVERDUE: 'Overdue',
    COMPLETED: 'Completed',
    OPEN: 'Pending',
    'IN PROGRESS': 'Pending',
    'ON HOLD': 'On Hold',
    RESOLVED: 'Resolved'
  };
  return mapping[text.toUpperCase()] || text;
};

const normalizePipelineApiPayload = (form, salespersonMap = []) => {
  const salespersonId = salespersonMap.find(person => person.name === form.salesperson)?.id ?? form.salesperson;

  return {
    date_added: form.dateAdded || '',
    salesperson: salespersonId,
    customer_company: form.customer || '',
    location_town: form.location || '',
    contact_person: form.contactPerson || '',
    telephone: form.telephone || '',
    customer_type: form.customerType || '',
    product_service: form.product || '',
    requirement_specifications: form.specs || '',
    estimated_quantity: form.estQty || '',
    unit: form.unit || 'Pcs',
    estimated_value_ugx: Number(form.estValue || 0),
    last_contact_date: form.lastContactDate || '',
    last_discussion_feedback: form.lastDiscussion || '',
    next_action: form.nextAction || '',
    next_followup_date: form.nextFollowUpDate || '',
    followup_status: (form.followUpStatus || 'Pending').toUpperCase(),
    sales_stage: form.salesStage || '',
    probability_pct: Number(form.probability || 0),
    quotation_no: form.quotationNo || '',
    quotation_value_ugx: Number(form.quotationValue || 0),
    sample_trial_status: form.sampleStatus || 'Not Started',
    actual_order_value_ugx: Number(form.actualOrderValue || 0),
    reason_lost: form.reasonLost || '',
    remarks_management_notes: form.remarks || '',
    competitor_won_by: form.competitor || '',
    stage_last_updated: form.stageLastUpdated || '',
    corrective_action: form.correctiveAction || ''
  };
};

const normalizePipelineRecord = (item, fallbackId) => ({
  id: item?.id ?? item?.prospect_id ?? fallbackId,
  prospectId: item?.prospect_id || '',
  dateAdded: item?.date_added || '',
  salesperson: item?.salesperson_detail?.name || item?.salesperson || '',
  customer: item?.customer_company || '',
  location: item?.location_town || '',
  contactPerson: item?.contact_person || '',
  telephone: item?.telephone || '',
  customerType: item?.customer_type || '',
  product: item?.product_service || '',
  specs: item?.requirement_specifications || '',
  estQty: item?.estimated_quantity || '',
  unit: item?.unit || 'Pcs',
  estValue: Number(item?.estimated_value_ugx || 0),
  lastContactDate: item?.last_contact_date || '',
  lastDiscussion: item?.last_discussion_feedback || '',
  nextAction: item?.next_action || '',
  nextFollowUpDate: item?.next_followup_date || '',
  followUpStatus: normalizeStatusLabel(item?.followup_status),
  salesStage: item?.sales_stage || '',
  probability: Number(item?.probability_pct || 0),
  quotationNo: item?.quotation_no || '',
  quotationValue: Number(item?.quotation_value_ugx || 0),
  sampleStatus: item?.sample_trial_status || 'Not Started',
  actualOrderValue: Number(item?.actual_order_value_ugx || 0),
  reasonLost: item?.reason_lost || '',
  remarks: item?.remarks_management_notes || '',
  competitor: item?.competitor_won_by || '',
  stageLastUpdated: item?.stage_last_updated || '',
  correctiveAction: item?.corrective_action || ''
});

const normalizeActivityApiPayload = (form, salespersonMap = []) => {
  const salespersonId = salespersonMap.find(person => person.name === form.salesperson)?.id ?? form.salesperson;

  return {
    salesperson: salespersonId,
    date: form.date || '',
    area_route_visited: form.areaRoute || '',
    customer_company: form.customer || '',
    specific_location: form.specificLocation || '',
    prospect_status: form.prospectStatus || '',
    contact_person: form.contactPerson || '',
    telephone: form.telephone || '',
    product_service: form.product || '',
    activity_type: form.activityType || '',
    requirement_estimated_volume: form.reqEstVolume || '',
    discussion_outcome: form.discussionOutcome || '',
    next_action: form.nextAction || '',
    next_followup_date: form.nextFollowUpDate || '',
    quotation_submitted_value_ugx: Number(form.quotationSubmittedValue || 0),
    order_received_value_ugx: Number(form.orderReceivedValue || 0),
    cash_collected_ugx: Number(form.cashCollected || 0),
    market_competitor_intelligence: form.marketIntel || '',
    management_support_needed: form.mgmtSupportNeeded || '',
    responsible_person_dept: form.respDept || '',
    required_by_date: form.requiredByDate || '',
    issue_status: form.issueStatus || ''
  };
};

const normalizeActivityRecord = (item, fallbackId) => ({
  id: item?.id ?? fallbackId,
  date: item?.date || '',
  salesperson: item?.salesperson_detail?.name || item?.salesperson || '',
  areaRoute: item?.area_route_visited || '',
  customer: item?.customer_company || '',
  specificLocation: item?.specific_location || '',
  prospectStatus: item?.prospect_status || '',
  contactPerson: item?.contact_person || '',
  telephone: item?.telephone || '',
  product: item?.product_service || '',
  activityType: item?.activity_type || '',
  reqEstVolume: item?.requirement_estimated_volume || '',
  discussionOutcome: item?.discussion_outcome || '',
  nextAction: item?.next_action || '',
  nextFollowUpDate: item?.next_followup_date || '',
  quotationSubmittedValue: Number(item?.quotation_submitted_value_ugx || 0),
  orderReceivedValue: Number(item?.order_received_value_ugx || 0),
  cashCollected: Number(item?.cash_collected_ugx || 0),
  marketIntel: item?.market_competitor_intelligence || '',
  mgmtSupportNeeded: item?.management_support_needed || '',
  respDept: item?.responsible_person_dept || '',
  requiredByDate: item?.required_by_date || '',
  issueStatus: normalizeStatusLabel(item?.issue_status)
});

const normalizeDashboardMetrics = (payload) => ({
  criticalAction: {
    overdueFollowUps: Number(payload?.critical_action?.overdue_followups || 0),
    dueToday: Number(payload?.critical_action?.due_today || 0),
    noDateSet: Number(payload?.critical_action?.no_date_set || 0)
  },
  pipelineHealth: {
    activeOpportunities: Number(payload?.pipeline_health?.active_opportunities || 0),
    totalPipelineValue: Number(payload?.pipeline_health?.total_pipeline_value || 0),
    quotationsPending: Number(payload?.pipeline_health?.quotations_pending || 0)
  },
  monthlyPerformance: {
    ordersWonMTD: Number(payload?.monthly_performance?.orders_won_mtd || 0),
    totalOrderValueUGX: Number(payload?.monthly_performance?.total_order_value_ugx || 0),
    cashCollectedUGX: Number(payload?.monthly_performance?.cash_collected_ugx || 0)
  },
  salespersonMatrix: Array.isArray(payload?.salesperson_matrix)
    ? payload.salesperson_matrix.map((person) => ({
      salespersonId: person.salesperson_id,
      salespersonName: person.salesperson_name || 'Unknown',
      totalProspects: Number(person.total_prospects || 0),
      activePipelineValue: Number(person.active_pipeline_value || 0),
      quotationsPending: Number(person.quotations_pending || 0),
      ordersWonValue: Number(person.orders_won_value || 0),
      overdueFollowUps: Number(person.overdue_followups || 0)
    }))
    : []
});

// Initial Customer Pipeline Dataset (29 fields compliant)
const INITIAL_PIPELINE = [
  {
    id: 'PR-001',
    dateAdded: '2026-08-25',
    salesperson: 'Haidare Karrar',
    customer: 'ZY Industries',
    location: 'Kampala Industrial Area',
    contactPerson: 'Mr. Alex Kato',
    telephone: '+256 772 100 200',
    customerType: 'Manufacturer',
    product: 'Customized Printed Polythene Bags',
    specs: 'Heavy duty, 50 micron, 2 color print',
    estQty: '20,000',
    unit: 'Pcs',
    estValue: 10000000,
    lastContactDate: '2026-09-08',
    lastDiscussion: 'Discussed artwork proofing and trial samples',
    nextAction: 'Follow up on sample approval',
    nextFollowUpDate: '2026-09-15',
    followUpStatus: 'Pending',
    salesStage: 'Requirement Identified',
    probability: 60,
    quotationNo: 'QT-2026-089',
    quotationValue: 10000000,
    sampleStatus: 'Sample Sent',
    actualOrderValue: 0,
    reasonLost: '',
    remarks: 'High potential long-term contract',
    competitor: '',
    stageLastUpdated: '2026-09-08',
    correctiveAction: ''
  },
  {
    id: 'PR-002',
    dateAdded: '2026-09-01',
    salesperson: 'Pouline Bwogi',
    customer: 'ABC Supermarkets',
    location: 'Nakawa, Kampala',
    contactPerson: 'Sarah Nabukalu',
    telephone: '+256 701 445 667',
    customerType: 'Retailer',
    product: 'Customized Printed Polythene Bags',
    specs: 'Carrier bags medium size branding',
    estQty: '5,000',
    unit: 'Pcs',
    estValue: 1000000,
    lastContactDate: '2026-09-07',
    lastDiscussion: 'Initial inquiry for shopping bags',
    nextAction: 'Send updated quote and pricing',
    nextFollowUpDate: '2026-09-05', // Overdue
    followUpStatus: 'Overdue',
    salesStage: 'New Lead',
    probability: 30,
    quotationNo: 'QT-2026-092',
    quotationValue: 1000000,
    sampleStatus: 'Not Started',
    actualOrderValue: 0,
    reasonLost: '',
    remarks: 'Price sensitive customer',
    competitor: 'KKDR Plastics',
    stageLastUpdated: '2026-09-07',
    correctiveAction: 'Review raw material discounts'
  },
  {
    id: 'PR-003',
    dateAdded: '2026-08-15',
    salesperson: 'Rogers Wandera',
    customer: 'XX Logistics Ltd',
    location: 'Bweyogerere',
    contactPerson: 'David Ochieng',
    telephone: '+256 782 990 112',
    customerType: 'Corporate',
    product: 'Customized Printed Polythene Bags',
    specs: 'Clear packaging sheets',
    estQty: '100',
    unit: 'Kg',
    estValue: 1000,
    lastContactDate: '2026-09-06',
    lastDiscussion: 'Quotation delivered by hand',
    nextAction: 'Negotiate price discount',
    nextFollowUpDate: '2026-09-04', // Overdue
    followUpStatus: 'Overdue',
    salesStage: 'Quotation Sent',
    probability: 50,
    quotationNo: 'QT-2026-077',
    quotationValue: 1000,
    sampleStatus: 'Approved',
    actualOrderValue: 0,
    reasonLost: '',
    remarks: 'Awaiting MD approval',
    competitor: '',
    stageLastUpdated: '2026-09-06',
    correctiveAction: ''
  },
  {
    id: 'PR-004',
    dateAdded: '2026-08-10',
    salesperson: 'Rogers Wandera',
    customer: 'LMN Traders',
    location: 'Kikuubo, Kampala',
    contactPerson: 'Moses Mugisha',
    telephone: '+256 752 334 112',
    customerType: 'Wholesaler',
    product: 'Customized Printed Polythene Bags',
    specs: 'Standard gauge 30 micron',
    estQty: '500',
    unit: 'Bags',
    estValue: 10,
    lastContactDate: '2026-09-08',
    lastDiscussion: 'Price comparison discussions',
    nextAction: 'Finalize payment terms',
    nextFollowUpDate: '2026-09-03', // Overdue
    followUpStatus: 'Overdue',
    salesStage: 'Negotiation',
    probability: 80,
    quotationNo: 'QT-2026-060',
    quotationValue: 10,
    sampleStatus: 'Approved',
    actualOrderValue: 0,
    reasonLost: '',
    remarks: 'Ready to order upon payment credit term confirmation',
    competitor: '',
    stageLastUpdated: '2026-09-08',
    correctiveAction: ''
  },
  {
    id: 'PR-005',
    dateAdded: '2026-09-02',
    salesperson: 'Pouline Bwogi',
    customer: 'Fresh Bakery Uganda',
    location: 'Ntinda',
    contactPerson: 'Grace Tumusiime',
    telephone: '+256 774 551 234',
    customerType: 'Manufacturer',
    product: 'Plain HDPE Bags',
    specs: 'Food grade transparent bread wrappers',
    estQty: '10,000',
    unit: 'Pcs',
    estValue: 5005500,
    lastContactDate: '2026-09-09',
    lastDiscussion: 'LPO Issued and deposit paid',
    nextAction: 'Send to production',
    nextFollowUpDate: '2026-09-12',
    followUpStatus: 'Completed',
    salesStage: 'Order Won',
    probability: 100,
    quotationNo: 'QT-2026-095',
    quotationValue: 5005500,
    sampleStatus: 'Approved',
    actualOrderValue: 5005500,
    reasonLost: '',
    remarks: 'Order won MTD. Advance deposit received.',
    competitor: '',
    stageLastUpdated: '2026-09-09',
    correctiveAction: ''
  }
];

// Initial Daily Activity Logs (22 fields compliant)
const INITIAL_DAILY_ACTIVITIES = [
  {
    id: 'ACT-101',
    date: '2026-09-08',
    salesperson: 'Haidare Karrar',
    areaRoute: 'Kampala Industrial Area',
    customer: 'XYZ Beverages',
    specificLocation: 'Plot 42 7th Street',
    prospectStatus: 'Existing Customer',
    contactPerson: 'John Kakooza',
    telephone: '+256 702 111 222',
    product: 'Customized Printed Polythene Bags',
    activityType: 'Physical Visit',
    reqEstVolume: '15,000 units',
    discussionOutcome: 'Customer requested sample modification for exact color match.',
    nextAction: 'Deliver modified sample to QC',
    nextFollowUpDate: '2026-09-16',
    quotationSubmittedValue: 10000000,
    orderReceivedValue: 0,
    cashCollected: 0,
    marketIntel: 'Competitor offering shopping bags at UGX 7,501 per pack',
    mgmtSupportNeeded: 'Make the trial sample as per customer exact spec',
    respDept: 'Production',
    requiredByDate: '2026-09-16',
    issueStatus: 'Resolved'
  },
  {
    id: 'ACT-102',
    date: '2026-09-07',
    salesperson: 'Pouline Bwogi',
    areaRoute: 'Kikuubo Market & Downtown',
    customer: 'ABC Traders',
    specificLocation: 'Nabugabo Road',
    prospectStatus: 'New Prospect Identified',
    contactPerson: 'Samson K',
    telephone: '+256 712 333 444',
    product: 'LDPE Packaging Rolls',
    activityType: 'Physical Visit',
    reqEstVolume: '20 Rolls',
    discussionOutcome: 'Customer complaining about competitor price at 7500 UGX',
    nextAction: 'Provide updated volume discount price list',
    nextFollowUpDate: '2026-09-11',
    quotationSubmittedValue: 1000000,
    orderReceivedValue: 0,
    cashCollected: 0,
    marketIntel: 'Competitor offering shopping at 7,500 UGX',
    mgmtSupportNeeded: 'Prepare trial samples for testing',
    respDept: 'Production',
    requiredByDate: '2026-09-20',
    issueStatus: 'On Hold'
  },
  {
    id: 'ACT-103',
    date: '2026-09-09',
    salesperson: 'Pouline Bwogi',
    areaRoute: 'Ntinda Industrial',
    customer: 'Fresh Bakery Uganda',
    specificLocation: 'Ntinda Complex',
    prospectStatus: 'Existing Customer',
    contactPerson: 'Grace Tumusiime',
    telephone: '+256 774 551 234',
    product: 'Plain HDPE Bags',
    activityType: 'Follow-up Interaction',
    reqEstVolume: '10,000 Pcs',
    discussionOutcome: 'Picked up cheque payment for previous invoice',
    nextAction: 'Bank cheque and confirm delivery dispatch date',
    nextFollowUpDate: '2026-09-12',
    quotationSubmittedValue: 0,
    orderReceivedValue: 5005500,
    cashCollected: 1003000,
    marketIntel: 'Demanding fast turnaround time due to bakery expansion',
    mgmtSupportNeeded: 'Expedite delivery dispatch',
    respDept: 'Logistics/Dispatch',
    requiredByDate: '2026-09-13',
    issueStatus: 'In Progress'
  }
];

// Helper to format currency in UGX
const formatUGX = (amount) => {
  if (amount === undefined || amount === null) return 'UGX 0';
  return 'UGX ' + Number(amount).toLocaleString('en-US');
};

export default function App({ onLogout, department = 'marketing', user = {} }) {
  const isSalesUser = department.trim().toLowerCase() === 'sales';
  const [activeTab, setActiveTab] = useState(isSalesUser ? 'pipeline' : 'dashboard');
  const [pipelineData, setPipelineData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [salespersonData, setSalespersonData] = useState([]);
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [dashboardMetricsError, setDashboardMetricsError] = useState('');
  const [salespersonForm, setSalespersonForm] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    department: 'Sales',
    is_active: true
  });
  const [isSalespersonModalOpen, setIsSalespersonModalOpen] = useState(false);
  const [isSalespersonDetailModalOpen, setIsSalespersonDetailModalOpen] = useState(false);
  const [selectedSalespersonItem, setSelectedSalespersonItem] = useState(null);
  const [salesStages, setSalesStages] = useState(INITIAL_SALES_STAGES);
  const [customerTypes, setCustomerTypes] = useState(INITIAL_CUSTOMER_TYPES);
  const [departments, setDepartments] = useState(INITIAL_DEPTS);
  const [issueStatuses, setIssueStatuses] = useState(INITIAL_ISSUE_STATUSES);
  const salespersons = salespersonData.length > 0
  ? salespersonData.map(person => person.name)
  : INITIAL_SALESPERSONS;
  const loggedInSalesperson = salespersonData.find(person => {
    const userEmail = user.email?.trim().toLowerCase();
    const userName = user.name?.trim().toLowerCase();
    return (userEmail && person.email?.trim().toLowerCase() === userEmail)
      || (userName && person.name?.trim().toLowerCase() === userName);
  })?.name || user.name || salespersons[0];

  // Search & Filter States
  const [pipelineSearch, setPipelineSearch] = useState('');
  const [pipelineStageFilter, setPipelineStageFilter] = useState('ALL');
  const [activitySearch, setActivitySearch] = useState('');
  
  // Weekly Report Date Range
  const [weeklyStartDate, setWeeklyStartDate] = useState('2026-09-21');
  const [weeklyEndDate, setWeeklyEndDate] = useState('2026-09-26');
  const [weeklyReport, setWeeklyReport] = useState(null);
  const [weeklyReportLoading, setWeeklyReportLoading] = useState(false);
  const [weeklyReportError, setWeeklyReportError] = useState('');

  // Modal Controls
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPipelineItem, setSelectedPipelineItem] = useState(null);
  
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedActivityItem, setSelectedActivityItem] = useState(null);

  // New item form template
  const emptyPipelineForm = {
    id: '',
    prospectId: '',
    dateAdded: new Date().toISOString().split('T')[0],
    salesperson: loggedInSalesperson,
    customer: '',
    location: '',
    contactPerson: '',
    telephone: '',
    customerType: customerTypes[0],
    product: INITIAL_PRODUCTS[0],
    specs: '',
    estQty: '',
    unit: 'Pcs',
    estValue: 0,
    lastContactDate: new Date().toISOString().split('T')[0],
    lastDiscussion: '',
    nextAction: '',
    nextFollowUpDate: '',
    followUpStatus: 'Pending',
    salesStage: salesStages[0],
    probability: 50,
    quotationNo: '',
    quotationValue: 0,
    sampleStatus: 'Not Started',
    actualOrderValue: 0,
    reasonLost: '',
    remarks: '',
    competitor: '',
    stageLastUpdated: new Date().toISOString().split('T')[0],
    correctiveAction: ''
  };

  const [pipelineForm, setPipelineForm] = useState(emptyPipelineForm);

  const emptyActivityForm = {
    id: '',
    date: new Date().toISOString().split('T')[0],
    salesperson: loggedInSalesperson,
    areaRoute: '',
    customer: '',
    specificLocation: '',
    prospectStatus: 'New Prospect Identified',
    contactPerson: '',
    telephone: '',
    product: INITIAL_PRODUCTS[0],
    activityType: 'Physical Visit',
    reqEstVolume: '',
    discussionOutcome: '',
    nextAction: '',
    nextFollowUpDate: '',
    quotationSubmittedValue: 0,
    orderReceivedValue: 0,
    cashCollected: 0,
    marketIntel: '',
    mgmtSupportNeeded: '',
    respDept: departments[0],
    requiredByDate: '',
    issueStatus: issueStatuses[0]
  };

  const [activityForm, setActivityForm] = useState(emptyActivityForm);

  // Lists management state for adding new master list elements
  const [newListInputs, setNewListInputs] = useState({
    salesperson: '',
    salesStage: '',
    customerType: '',
    department: '',
    issueStatus: ''
  });
  useEffect(() => {
  fetch('https://api.navapacksolutions.com/api/pipeline/')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch pipeline data');
      }
      return response.json();
    })
    .then(data => {
      const formattedData = data.map(item => ({
        id: item.id,
        prospectId: item.prospect_id,
        dateAdded: item.date_added,
        salesperson: item.salesperson_detail?.name || '',
        customer: item.customer_company,
        location: item.location_town,
        contactPerson: item.contact_person,
        telephone: item.telephone,
        customerType: item.customer_type,
        product: item.product_service,
        specs: item.requirement_specifications,
        estQty: item.estimated_quantity,
        unit: item.unit,
        estValue: Number(item.estimated_value_ugx),
        lastContactDate: item.last_contact_date,
        lastDiscussion: item.last_discussion_feedback,
        nextAction: item.next_action,
        nextFollowUpDate: item.next_followup_date,
        followUpStatus: item.followup_status,
        salesStage: item.sales_stage,
        probability: item.probability_pct,
        quotationNo: item.quotation_no,
        quotationValue: Number(item.quotation_value_ugx),
        sampleStatus: item.sample_trial_status,
        actualOrderValue: Number(item.actual_order_value_ugx),
        reasonLost: item.reason_lost,
        remarks: item.remarks_management_notes,
        competitor: item.competitor_won_by,
        stageLastUpdated: item.stage_last_updated,
        correctiveAction: item.corrective_action
      }));

      setPipelineData(formattedData);
    })
    .catch(error => {
      console.error('Error fetching pipeline data:', error);
    });
}, []);
// Daily Activity API
useEffect(() => {
  fetch(ACTIVITY_API_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch daily activities');
      }
      return response.json();
    })
    .then(data => {
      const formattedData = data.map(item => normalizeActivityRecord(item, item.id));
      setActivityData(formattedData);
    })
    .catch(error => {
      console.error('Error fetching daily activities:', error);
    });
}, []);
// Salesperson API
useEffect(() => {
  fetch('https://api.navapacksolutions.com/api/salespersons/')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch salespersons');
      }
      return response.json();
    })
    .then(data => {
      console.log('SALESPERSON DATA:', data);
      setSalespersonData(data);
    })
    .catch(error => {
      console.error('Error fetching salespersons:', error);
    });
}, []);

// Dashboard aggregate metrics API
useEffect(() => {
  fetch(DASHBOARD_METRICS_API_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard metrics (${response.status})`);
      }
      return response.json();
    })
    .then(data => {
      setDashboardMetrics(normalizeDashboardMetrics(data));
      setDashboardMetricsError('');
    })
    .catch(error => {
      console.error('Error fetching dashboard metrics:', error);
      setDashboardMetricsError('Live dashboard metrics are unavailable. Showing local data.');
    });
}, []);

useEffect(() => {
  const controller = new AbortController();

  setWeeklyReportLoading(true);
  setWeeklyReportError('');
  fetch(`${REPORTS_API_URL}?period=weekly&start_date=${weeklyStartDate}&end_date=${weeklyEndDate}`, {
    signal: controller.signal
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch weekly report (${response.status})`);
      }
      return response.json();
    })
    .then(data => setWeeklyReport(data))
    .catch(error => {
      if (error.name !== 'AbortError') {
        console.error('Error fetching weekly report:', error);
        setWeeklyReportError('Live report data is unavailable. Showing the local report below.');
      }
    })
    .finally(() => setWeeklyReportLoading(false));

  return () => controller.abort();
}, [weeklyStartDate, weeklyEndDate]);




  const metrics = useMemo(() => {
    // Critical Action
    const overdueFollowUps = pipelineData.filter(item => {
      if (!item.nextFollowUpDate) return false;
      return new Date(item.nextFollowUpDate) < new Date('2026-09-10') && item.salesStage !== 'Order Won' && item.salesStage !== 'Order Lost';
    }).length;

    const followUpsToday = pipelineData.filter(item => item.nextFollowUpDate === '2026-09-10').length;
    const noDateSetAlert = pipelineData.filter(item => !item.nextFollowUpDate || item.nextFollowUpDate === '').length;

    // Pipeline Health
    const activeOps = pipelineData.filter(item => item.salesStage !== 'Order Won' && item.salesStage !== 'Order Lost');
    const totalPipelineVal = activeOps.reduce((sum, item) => sum + Number(item.estValue || 0), 0);
    const quotationsPending = pipelineData.filter(item => item.salesStage === 'Quotation Sent').length;

    // Monthly Performance
    const ordersWon = pipelineData.filter(item => item.salesStage === 'Order Won');
    const ordersWonMTD = ordersWon.length;
    const totalOrderValueUGX = ordersWon.reduce((sum, item) => sum + Number(item.actualOrderValue || item.estValue || 0), 0);
    const cashCollectedUGX = activityData.reduce((sum, item) => sum + Number(item.cashCollected || 0), 0);

    const fallbackMetrics = {
      overdueFollowUps,
      followUpsToday,
      noDateSetAlert,
      activeOpportunitiesCount: activeOps.length,
      totalPipelineVal,
      quotationsPending,
      ordersWonMTD,
      totalOrderValueUGX,
      cashCollectedUGX
    };

    if (!dashboardMetrics) return fallbackMetrics;

    return {
      overdueFollowUps: dashboardMetrics.criticalAction.overdueFollowUps,
      followUpsToday: dashboardMetrics.criticalAction.dueToday,
      noDateSetAlert: dashboardMetrics.criticalAction.noDateSet,
      activeOpportunitiesCount: dashboardMetrics.pipelineHealth.activeOpportunities,
      totalPipelineVal: dashboardMetrics.pipelineHealth.totalPipelineValue,
      quotationsPending: dashboardMetrics.pipelineHealth.quotationsPending,
      ordersWonMTD: dashboardMetrics.monthlyPerformance.ordersWonMTD,
      totalOrderValueUGX: dashboardMetrics.monthlyPerformance.totalOrderValueUGX,
      cashCollectedUGX: dashboardMetrics.monthlyPerformance.cashCollectedUGX
    };
  }, [pipelineData, activityData, dashboardMetrics]);

  const handleSavePipeline = async (e) => {
    e.preventDefault();

    const payload = normalizePipelineApiPayload(pipelineForm, salespersonData);
    const apiUrl = pipelineForm.id ? `${PIPELINE_API_URL}${pipelineForm.id}/` : PIPELINE_API_URL;
    const method = pipelineForm.id ? 'PUT' : 'POST';

    try {
      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save pipeline record (${response.status}): ${errorText}`);
      }

      const savedRecord = await response.json();
      const normalizedRecord = normalizePipelineRecord(savedRecord, pipelineForm.id || `PR-${String(pipelineData.length + 1).padStart(3, '0')}`);

      setPipelineData(prev => {
        if (pipelineForm.id) {
          return prev.map(item => item.id === pipelineForm.id ? normalizedRecord : item);
        }
        return [normalizedRecord, ...prev];
      });

      setPipelineForm(emptyPipelineForm);
      setIsPipelineModalOpen(false);
    } catch (error) {
      console.error('Error saving pipeline record:', error);
      alert('Unable to save the customer pipeline record. Please try again.');
    }
  };

  const handleEditPipeline = (item) => {
    setPipelineForm(item);
    setIsPipelineModalOpen(true);
  };

  const handleDeletePipeline = async (id) => {
    if (isSalesUser) return;

    if (!window.confirm('Are you sure you want to delete this customer prospect record?')) {
      return;
    }

    try {
      const response = await fetch(`${PIPELINE_API_URL}${id}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete pipeline record (${response.status})`);
      }

      setPipelineData(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting pipeline record:', error);
      alert('Unable to delete the customer pipeline record. Please try again.');
    }
  };

  const handleSaveActivity = async (e) => {
    e.preventDefault();

    const payload = normalizeActivityApiPayload(activityForm, salespersonData);
    const apiUrl = activityForm.id ? `${ACTIVITY_API_URL}${activityForm.id}/` : ACTIVITY_API_URL;
    const method = activityForm.id ? 'PUT' : 'POST';

    try {
      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save daily activity (${response.status}): ${errorText}`);
      }

      const savedRecord = await response.json();
      const normalizedRecord = normalizeActivityRecord(savedRecord, activityForm.id || `ACT-${String(activityData.length + 101)}`);

      setActivityData(prev => {
        if (activityForm.id) {
          return prev.map(item => item.id === activityForm.id ? normalizedRecord : item);
        }
        return [normalizedRecord, ...prev];
      });

      setActivityForm(emptyActivityForm);
      setIsActivityModalOpen(false);
    } catch (error) {
      console.error('Error saving daily activity:', error);
      alert('Unable to save the daily activity record. Please try again.');
    }
  };

  const handleEditActivity = (item) => {
    setActivityForm(item);
    setIsActivityModalOpen(true);
  };

  const handleDeleteActivity = async (id) => {
    if (isSalesUser) return;

    if (!window.confirm('Are you sure you want to delete this activity log?')) {
      return;
    }

    try {
      const response = await fetch(`${ACTIVITY_API_URL}${id}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete daily activity (${response.status})`);
      }

      setActivityData(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting daily activity:', error);
      alert('Unable to delete the daily activity record. Please try again.');
    }
  };

  const handleSaveSalesperson = async (e) => {
    e.preventDefault();

    const payload = normalizeSalespersonApiPayload(salespersonForm);
    const apiUrl = salespersonForm.id ? `${SALESPERSON_API_URL}${salespersonForm.id}/` : SALESPERSON_API_URL;
    const method = salespersonForm.id ? 'PUT' : 'POST';

    try {
      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save salesperson (${response.status}): ${errorText}`);
      }

      const savedRecord = await response.json();
      const normalizedRecord = normalizeSalespersonRecord(savedRecord, salespersonForm.id || savedRecord.id);

      setSalespersonData(prev => {
        if (salespersonForm.id) {
          return prev.map(item => item.id === salespersonForm.id ? normalizedRecord : item);
        }
        return [normalizedRecord, ...prev];
      });

      setSalespersonForm({
        id: '',
        name: '',
        email: '',
        phone: '',
        department: 'Sales',
        is_active: true
      });
      setIsSalespersonModalOpen(false);
    } catch (error) {
      console.error('Error saving salesperson:', error);
      alert('Unable to save the salesperson record. Please try again.');
    }
  };

  const handleEditSalesperson = (person) => {
    setSalespersonForm({
      id: person.id,
      name: person.name || '',
      email: person.email || '',
      phone: person.phone || '',
      department: person.department || 'Sales',
      is_active: Boolean(person.is_active)
    });
    setIsSalespersonModalOpen(true);
  };

  const handleViewSalesperson = (person) => {
    setSelectedSalespersonItem(person);
    setIsSalespersonDetailModalOpen(true);
  };

  const handleDeleteSalesperson = async (id) => {
    if (!window.confirm('Are you sure you want to delete this salesperson?')) {
      return;
    }

    try {
      const response = await fetch(`${SALESPERSON_API_URL}${id}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete salesperson (${response.status})`);
      }

      setSalespersonData(prev => prev.filter(person => person.id !== id));
    } catch (error) {
      console.error('Error deleting salesperson:', error);
      alert('Unable to delete the salesperson record. Please try again.');
    }
  };

  const filteredPipeline = useMemo(() => {
    return pipelineData.filter(item => {
      const matchesSearch = 
        item.customer.toLowerCase().includes(pipelineSearch.toLowerCase()) ||
        item.salesperson.toLowerCase().includes(pipelineSearch.toLowerCase()) ||
        item.product.toLowerCase().includes(pipelineSearch.toLowerCase()) ||
        item.location.toLowerCase().includes(pipelineSearch.toLowerCase());
      
      const matchesStage = pipelineStageFilter === 'ALL' || item.salesStage === pipelineStageFilter;
      return matchesSearch && matchesStage;
    });
  }, [pipelineData, pipelineSearch, pipelineStageFilter]);

  const filteredActivities = useMemo(() => {
    return activityData.filter(item => {
      return (
        item.customer.toLowerCase().includes(activitySearch.toLowerCase()) ||
        item.salesperson.toLowerCase().includes(activitySearch.toLowerCase()) ||
        item.areaRoute.toLowerCase().includes(activitySearch.toLowerCase()) ||
        item.product.toLowerCase().includes(activitySearch.toLowerCase())
      );
    });
  }, [activityData, activitySearch]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Main Container */}
      <div className="flex-1 w-full px-6 lg:px-8 xl:px-10 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Navigation Sidebar Tabs */}
        <nav className="w-full lg:w-72 flex-shrink-0 bg-white rounded-xl shadow-sm border border-slate-200 p-4 self-start sticky top-20">
          <div className="text-sm font-semibold text-slate-400 uppercase px-3 py-2">Navigation Menu</div>
          <div className="space-y-1">
            {!isSalesUser && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dash Board</span>
            </button>
            )}

            <button
              onClick={() => setActiveTab('pipeline')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                activeTab === 'pipeline'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Customer Pipeline</span>
            </button>
            {!isSalesUser && (
                        <button
              onClick={() => setActiveTab('salesperson')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                activeTab === 'salesperson'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Salesperson</span>
            </button>
            )}

            <button
              onClick={() => setActiveTab('activity')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                activeTab === 'activity'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Daily Activity</span>
            </button>

            {!isSalesUser && (
            <button
              onClick={() => setActiveTab('weekly')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                activeTab === 'weekly'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Reports</span>
            </button>
            )}

            {!isSalesUser && (
            <button
              onClick={() => setActiveTab('lists')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                activeTab === 'lists'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Master Lists</span>
            </button>
            )}
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="mt-6 w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-rose-600 border border-rose-200 hover:bg-rose-50 hover:text-rose-700 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>

          <div className="mt-8 pt-4 border-t border-slate-100 px-3">
            <div className="text-xs text-slate-500 font-medium">Quick Summary</div>
            <div className="mt-2 text-xs space-y-1 text-slate-600">
              <div className="flex justify-between"><span>Pipeline Val:</span> <span className="font-semibold">{formatUGX(metrics.totalPipelineVal)}</span></div>
              <div className="flex justify-between"><span>Active Reps:</span> <span className="font-semibold">{salespersons.length}</span></div>
              <div className="flex justify-between"><span>Overdue Tasks:</span> <span className="text-pink-600 font-semibold">{metrics.overdueFollowUps}</span></div>
            </div>
          </div>
        </nav>

        {/* Content View Area */}
        <main className="flex-1 min-w-0">
          <h1 className="mb-6 text-3xl font-bold tracking-tight text-slate-900">
            Navapack Sales Follow-up Tracker
          </h1>
          
          {/* ======================================================== */}
          {/* TAB 1: DASH BOARD VIEW                                    */}
          {/* ======================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {dashboardMetricsError && (
                <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{dashboardMetricsError}</span>
                </div>
              )}
              
              {/* Top Metric Cards Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* Critical Action Card (Magenta/Pink Theme) */}
                <div className="bg-gradient-to-br from-pink-50 to-rose-100 border border-pink-300 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-pink-200">
                    <span className="text-xs font-bold tracking-wider text-pink-700 uppercase flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-pink-600" />
                      CRITICAL ACTION
                    </span>
                    <span className="px-2 py-0.5 text-xs font-bold bg-pink-600 text-white rounded-full">Alert</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-pink-900">Overdue Follow-ups:</span>
                      <span className="text-xl font-extrabold text-pink-700 bg-white/80 px-2.5 py-0.5 rounded-lg border border-pink-200">
                        {metrics.overdueFollowUps}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-pink-800">
                      <span>Follow-ups Due Today:</span>
                      <span className="font-semibold text-slate-700">{metrics.followUpsToday}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-pink-800">
                      <span>No Date Set Alert:</span>
                      <span className="font-semibold text-slate-700">{metrics.noDateSetAlert}</span>
                    </div>
                  </div>
                </div>

                {/* Pipeline Health Card (Cyan/Blue Theme) */}
                <div className="bg-gradient-to-br from-cyan-50 to-sky-100 border border-cyan-300 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-cyan-200">
                    <span className="text-xs font-bold tracking-wider text-cyan-800 uppercase flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-cyan-600" />
                      PIPELINE HEALTH
                    </span>
                    <span className="px-2 py-0.5 text-xs font-bold bg-cyan-700 text-white rounded-full">Active</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-cyan-950">Active Opportunities:</span>
                      <span className="text-xl font-extrabold text-cyan-800 bg-white/80 px-2.5 py-0.5 rounded-lg border border-cyan-200">
                        {metrics.activeOpportunitiesCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-cyan-900">
                      <span>Total Pipeline Val:</span>
                      <span className="font-bold text-sky-900">{formatUGX(metrics.totalPipelineVal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-cyan-900">
                      <span>Quotations Pending:</span>
                      <span className="font-semibold text-amber-700">{metrics.quotationsPending}</span>
                    </div>
                  </div>
                </div>

                {/* Monthly Performance Card (Green Theme) */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-300 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                    <span className="text-xs font-bold tracking-wider text-emerald-800 uppercase flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      MONTHLY PERFORMANCE
                    </span>
                    <span className="px-2 py-0.5 text-xs font-bold bg-emerald-600 text-white rounded-full">MTD</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-emerald-950">Orders Won MTD:</span>
                      <span className="text-xl font-extrabold text-emerald-700 bg-white/80 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                        {metrics.ordersWonMTD}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-emerald-900">
                      <span>Total Order Value:</span>
                      <span className="font-bold text-emerald-800">{formatUGX(metrics.totalOrderValueUGX)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-emerald-900">
                      <span>Cash Collected:</span>
                      <span className="font-bold text-emerald-800">{formatUGX(metrics.cashCollectedUGX)}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Salesperson Pipeline Performance Matrix Table */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-800 text-white flex justify-between items-center">
                  <h2 className="font-bold text-base flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                    Salesperson Pipeline Performance Matrix
                  </h2>
                  <span className="text-xs text-slate-300">Live Consolidated Data</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold">
                        <th className="p-3 border-r border-slate-200">Salesperson</th>
                        <th className="p-3 text-center border-r border-slate-200">Total Prospects</th>
                        <th className="p-3 text-right border-r border-slate-200">Active Pipeline Value (UGX)</th>
                        <th className="p-3 text-center border-r border-slate-200 bg-yellow-100 text-yellow-900">Quotations Pending</th>
                        <th className="p-3 text-right border-r border-slate-200">Orders Won Value (UGX)</th>
                        <th className="p-3 text-center">Overdue Follow-ups</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {(dashboardMetrics?.salespersonMatrix || salespersons.map(rep => ({
                        salespersonName: rep,
                        totalProspects: pipelineData.filter(i => i.salesperson === rep).length,
                        activePipelineValue: pipelineData
                          .filter(i => i.salesperson === rep && i.salesStage !== 'Order Won' && i.salesStage !== 'Order Lost')
                          .reduce((sum, i) => sum + Number(i.estValue || 0), 0),
                        quotationsPending: pipelineData.filter(i => i.salesperson === rep && i.salesStage === 'Quotation Sent').length,
                        ordersWonValue: pipelineData
                          .filter(i => i.salesperson === rep && i.salesStage === 'Order Won')
                          .reduce((sum, i) => sum + Number(i.actualOrderValue || i.estValue || 0), 0),
                        overdueFollowUps: pipelineData.filter(i => i.salesperson === rep && i.nextFollowUpDate && new Date(i.nextFollowUpDate) < new Date('2026-09-10') && i.salesStage !== 'Order Won' && i.salesStage !== 'Order Lost').length
                      }))).map((person) => {
                        const rep = person.salespersonName;

                        return (
                          <tr key={rep} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 font-semibold text-slate-800 border-r border-slate-200">{rep}</td>
                            <td className="p-3 text-center border-r border-slate-200">{person.totalProspects}</td>
                            <td className="p-3 text-right font-medium text-slate-700 border-r border-slate-200">{formatUGX(person.activePipelineValue)}</td>
                            <td className="p-3 text-center border-r border-slate-200 bg-yellow-50 text-yellow-800 font-bold">{person.quotationsPending}</td>
                            <td className="p-3 text-right font-medium text-emerald-700 border-r border-slate-200">{formatUGX(person.ordersWonValue)}</td>
                            <td className="p-3 text-center">
                              {person.overdueFollowUps > 0 ? (
                                <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-pink-100 text-pink-700">
                                  {person.overdueFollowUps}
                                </span>
                              ) : (
                                <span className="text-slate-400">0</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      
                      {/* Summary Row */}
                      <tr className="bg-slate-900 text-white font-bold">
                        <td className="p-3 border-r border-slate-700">TOTAL TEAM</td>
                        <td className="p-3 text-center border-r border-slate-700">{pipelineData.length}</td>
                        <td className="p-3 text-right border-r border-slate-700 text-cyan-300">{formatUGX(metrics.totalPipelineVal)}</td>
                        <td className="p-3 text-center border-r border-slate-700 text-yellow-300">{metrics.quotationsPending}</td>
                        <td className="p-3 text-right border-r border-slate-700 text-emerald-300">{formatUGX(metrics.totalOrderValueUGX)}</td>
                        <td className="p-3 text-center text-pink-300">{metrics.overdueFollowUps}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: CUSTOMER PIPELINE (29 Columns Datatable)          */}
          {/* ======================================================== */}
          {activeTab === 'pipeline' && (
            <div className="space-y-4">
              
              {/* Toolbar */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-3 justify-between items-center">
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search company, sales, product..."
                      value={pipelineSearch}
                      onChange={(e) => setPipelineSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <select
                    value={pipelineStageFilter}
                    onChange={(e) => setPipelineStageFilter(e.target.value)}
                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    <option value="ALL">All Sales Stages</option>
                    {salesStages.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
                  <button
                    onClick={() => {
                      setPipelineForm(emptyPipelineForm);
                      setIsPipelineModalOpen(true);
                    }}
                    className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Prospect</span>
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-3 bg-sky-800 text-white flex justify-between items-center text-xs">
                  <span className="font-semibold uppercase tracking-wider">Master Customer Pipeline Database (29 Data Fields)</span>
                  <span>Showing {filteredPipeline.length} of {pipelineData.length} records</span>
                </div>
                
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                  <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                    <thead className="bg-slate-100 text-slate-700 sticky top-0 border-b border-slate-200 font-bold z-10">
                      <tr>
                        <th className="p-2 border-r border-slate-200 sticky left-0 bg-slate-100">Actions</th>
                        <th className="p-2 border-r border-slate-200">Prospect ID</th>
                        <th className="p-2 border-r border-slate-200">Record ID</th>
                        <th className="p-2 border-r border-slate-200">Date Added</th>
                        <th className="p-2 border-r border-slate-200">Salesperson</th>
                        <th className="p-2 border-r border-slate-200">Customer / Company</th>
                        <th className="p-2 border-r border-slate-200">Location / Town</th>
                        <th className="p-2 border-r border-slate-200">Contact Person</th>
                        <th className="p-2 border-r border-slate-200">Telephone</th>
                        <th className="p-2 border-r border-slate-200">Customer Type</th>
                        <th className="p-2 border-r border-slate-200">Product / Service</th>
                        <th className="p-2 border-r border-slate-200">Requirements / Specs</th>
                        <th className="p-2 border-r border-slate-200">Est. Qty</th>
                        <th className="p-2 border-r border-slate-200">Unit</th>
                        <th className="p-2 border-r border-slate-200 text-right">Est. Value (UGX)</th>
                        <th className="p-2 border-r border-slate-200">Last Contact Date</th>
                        <th className="p-2 border-r border-slate-200">Last Discussion</th>
                        <th className="p-2 border-r border-slate-200">Next Action</th>
                        <th className="p-2 border-r border-slate-200">Next Follow-up Date</th>
                        <th className="p-2 border-r border-slate-200">Follow-up Status</th>
                        <th className="p-2 border-r border-slate-200">Sales Stage</th>
                        <th className="p-2 border-r border-slate-200">Prob %</th>
                        <th className="p-2 border-r border-slate-200">Quotation No.</th>
                        <th className="p-2 border-r border-slate-200 text-right">Quotation Value (UGX)</th>
                        <th className="p-2 border-r border-slate-200">Sample/Trial Status</th>
                        <th className="p-2 border-r border-slate-200 text-right">Actual Order Value</th>
                        <th className="p-2 border-r border-slate-200">Reason Lost</th>
                        <th className="p-2 border-r border-slate-200">Remarks / Mgmt Notes</th>
                        <th className="p-2 border-r border-slate-200">Competitor Won By</th>
                        <th className="p-2 border-r border-slate-200">Stage Last Updated</th>
                        <th className="p-2">Corrective Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredPipeline.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-2 border-r border-slate-200 sticky left-0 bg-white shadow-sm flex items-center space-x-1">
                            <button
                              onClick={() => {
                                setSelectedPipelineItem(item);
                                setIsDetailModalOpen(true);
                              }}
                              className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-sky-600"
                              title="View Full Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleEditPipeline(item)}
                              className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-amber-600"
                              title="Edit Record"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeletePipeline(item.id)}
                              className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-red-600"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                          <td className="p-2 border-r border-slate-200 font-mono font-medium text-sky-900">{item.prospectId || item.id}</td>
                          <td className="p-2 border-r border-slate-200 font-mono text-slate-500">{item.id}</td>
                          <td className="p-2 border-r border-slate-200 text-slate-600">{item.dateAdded}</td>
                          <td className="p-2 border-r border-slate-200 font-medium text-slate-800">{item.salesperson}</td>
                          <td className="p-2 border-r border-slate-200 font-semibold text-sky-900">{item.customer}</td>
                          <td className="p-2 border-r border-slate-200 text-slate-600">{item.location}</td>
                          <td className="p-2 border-r border-slate-200 text-slate-700">{item.contactPerson}</td>
                          <td className="p-2 border-r border-slate-200 text-slate-600">{item.telephone}</td>
                          <td className="p-2 border-r border-slate-200 text-slate-600">{item.customerType}</td>
                          <td className="p-2 border-r border-slate-200 font-medium text-slate-800">{item.product}</td>
                          <td className="p-2 border-r border-slate-200 text-slate-600 truncate max-w-xs">{item.specs}</td>
                          <td className="p-2 border-r border-slate-200">{item.estQty}</td>
                          <td className="p-2 border-r border-slate-200 text-slate-500">{item.unit}</td>
                          <td className="p-2 border-r border-slate-200 text-right font-medium text-slate-800">{formatUGX(item.estValue)}</td>
                          <td className="p-2 border-r border-slate-200 text-slate-600">{item.lastContactDate}</td>
                          <td className="p-2 border-r border-slate-200 text-slate-600 truncate max-w-xs">{item.lastDiscussion}</td>
                          <td className="p-2 border-r border-slate-200 text-slate-700 font-medium">{item.nextAction}</td>
                          <td className="p-2 border-r border-slate-200 font-medium text-slate-800">{item.nextFollowUpDate}</td>
                          <td className="p-2 border-r border-slate-200">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.followUpStatus === 'Overdue' ? 'bg-pink-100 text-pink-800' :
                              item.followUpStatus === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {item.followUpStatus}
                            </span>
                          </td>
                          <td className="p-2 border-r border-slate-200">
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-300">
                              {item.salesStage}
                            </span>
                          </td>
                          <td className="p-2 border-r border-slate-200 text-slate-700">{item.probability}%</td>
                          <td className="p-2 border-r border-slate-200 text-slate-600">{item.quotationNo || '-'}</td>
                          <td className="p-2 border-r border-slate-200 text-right text-slate-700">{formatUGX(item.quotationValue)}</td>
                          <td className="p-2 border-r border-slate-200 text-slate-600">{item.sampleStatus}</td>
                          <td className="p-2 border-r border-slate-200 text-right font-bold text-emerald-700">{formatUGX(item.actualOrderValue)}</td>
                          <td className="p-2 border-r border-slate-200 text-rose-600">{item.reasonLost || '-'}</td>
                          <td className="p-2 border-r border-slate-200 text-slate-600 truncate max-w-xs">{item.remarks}</td>
                          <td className="p-2 border-r border-slate-200 text-slate-600">{item.competitor || '-'}</td>
                          <td className="p-2 border-r border-slate-200 text-slate-500">{item.stageLastUpdated}</td>
                          <td className="p-2 text-slate-600 truncate max-w-xs">{item.correctiveAction || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}
           {/* ======================================================== */}
          {/* TAB 3: SALESPERSON                                       */}
          {/* ======================================================== */}
          {activeTab === 'salesperson' && (
            <div className="space-y-4">

              {/* Header */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-900">
                  Salesperson
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Salesperson information from the backend database
                </p>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setSalespersonForm({
                        id: '',
                        name: '',
                        email: '',
                        phone: '',
                        department: 'Sales',
                        is_active: true
                      });
                      setIsSalespersonModalOpen(true);
                    }}
                    className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Salesperson</span>
                  </button>
                </div>
              </div>

              {/* Salesperson Table */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

                <div className="p-3 bg-sky-800 text-white flex justify-between items-center text-xs">
                  <span className="font-semibold uppercase tracking-wider">
                    Salesperson Database
                  </span>

                  <span>
                    Total Records: {salespersonData.length}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">

                    <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                      <tr>
                        <th className="p-3 border-r border-slate-200">Actions</th>
                        <th className="p-3 border-r border-slate-200">
                          Name
                        </th>
                        <th className="p-3 border-r border-slate-200">
                          Email
                        </th>
                        <th className="p-3 border-r border-slate-200">
                          Phone
                        </th>
                        <th className="p-3 border-r border-slate-200">
                          Department
                        </th>
                        <th className="p-3">
                          Is Active
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200">
                      {salespersonData.map((person) => (
                        <tr
                          key={person.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="p-3 border-r border-slate-200">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleViewSalesperson(person)}
                                className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-sky-600"
                                title="View salesperson"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEditSalesperson(person)}
                                className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-amber-600"
                                title="Edit salesperson"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSalesperson(person.id)}
                                className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-red-600"
                                title="Delete salesperson"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                          <td className="p-3 border-r border-slate-200 font-medium text-slate-800">
                            {person.name}
                          </td>

                          <td className="p-3 border-r border-slate-200 text-slate-600">
                            {person.email || '-'}
                          </td>

                          <td className="p-3 border-r border-slate-200 text-slate-600">
                            {person.phone || '-'}
                          </td>

                          <td className="p-3 border-r border-slate-200 text-slate-600">
                            {person.department || '-'}
                          </td>

                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                person.is_active
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {person.is_active ? 'Yes' : 'No'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: DAILY ACTIVITY LOG (22 Columns Datatable)         */}
          {/* ======================================================== */}

          
          {activeTab === 'activity' && (
            <div className="space-y-4">
              
              {/* Toolbar */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-3 justify-between items-center">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search daily logs, rep, area..."
                    value={activitySearch}
                    onChange={(e) => setActivitySearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <button
                  onClick={() => {
                    setActivityForm(emptyActivityForm);
                    setIsActivityModalOpen(true);
                  }}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm w-full md:w-auto justify-center"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log New Daily Activity</span>
                </button>
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-3 bg-sky-800 text-white flex justify-between items-center text-xs">
                  <span className="font-semibold uppercase tracking-wider">Field Visit & Touchpoint Daily Logs (22 Data Fields)</span>
                  <span>Total Records: {filteredActivities.length}</span>
                </div>

                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                  <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                    <thead className="bg-slate-100 text-slate-700 sticky top-0 border-b border-slate-200 font-bold z-10">
                      <tr>
                        <th className="p-2 border-r border-slate-200 sticky left-0 bg-slate-100">Actions</th>
                        <th className="p-2 border-r border-slate-200">Log ID</th>
                        <th className="p-2 border-r border-slate-200">Date</th>
                        <th className="p-2 border-r border-slate-200">Salesperson</th>
                        <th className="p-2 border-r border-slate-200">Area / Route Visited</th>
                        <th className="p-2 border-r border-slate-200">Customer / Company</th>
                        <th className="p-2 border-r border-slate-200">Specific Location</th>
                        <th className="p-2 border-r border-slate-200">Prospect Status</th>
                        <th className="p-2 border-r border-slate-200">Contact Person</th>
                        <th className="p-2 border-r border-slate-200">Telephone</th>
                        <th className="p-2 border-r border-slate-200">Product / Service</th>
                        <th className="p-2 border-r border-slate-200">Activity Type</th>
                        <th className="p-2 border-r border-slate-200">Req. Est Volume</th>
                        <th className="p-2 border-r border-slate-200">Discussion / Outcome</th>
                        <th className="p-2 border-r border-slate-200">Next Action</th>
                        <th className="p-2 border-r border-slate-200">Next Follow-up Date</th>
                        <th className="p-2 border-r border-slate-200 text-right">Quotation Submitted Val</th>
                        <th className="p-2 border-r border-slate-200 text-right">Order Received Val</th>
                        <th className="p-2 border-r border-slate-200 text-right">Cash Collected</th>
                        <th className="p-2 border-r border-slate-200">Market / Competitor Intel</th>
                        <th className="p-2 border-r border-slate-200">Mgmt Support Needed</th>
                        <th className="p-2 border-r border-slate-200">Resp Person / Dept</th>
                        <th className="p-2 border-r border-slate-200">Required By Date</th>
                        <th className="p-2">Issue Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredActivities.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-2 border-r border-slate-200 sticky left-0 bg-white shadow-sm flex items-center space-x-1">
                            <button
                              onClick={() => handleEditActivity(log)}
                              className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-amber-600"
                              title="Edit Activity"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            {!isSalesUser && (
                            <button
                              onClick={() => handleDeleteActivity(log.id)}
                              className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-red-600"
                              title="Delete Activity"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            )}
                          </td>
                          <td className="p-2 border-r border-slate-200 font-mono text-slate-900">{log.id}</td>
                          <td className="p-2 border-r border-slate-200 text-slate-600">{log.date}</td>
                          <td className="p-2 border-r border-slate-200 font-medium text-slate-800">{log.salesperson}</td>
                          <td className="p-2 border-r border-slate-200 text-slate-700">{log.areaRoute}</td>
                          <td className="p-2 border-r border-slate-200 font-semibold text-sky-900">{log.customer}</td>
                          <td className="p-2 border-r border-slate-200 text-slate-600">{log.specificLocation}</td>
                          <td className="p-2 border-r border-slate-200 text-slate-600">{log.prospectStatus}</td>
                          <td className="p-2 border-r border-slate-200 text-slate-700">{log.contactPerson}</td>
                          <td className="p-2 border-r border-slate-200 text-slate-600">{log.telephone}</td>
                          <td className="p-2 border-r border-slate-200 text-slate-800 font-medium">{log.product}</td>
                          <td className="p-2 border-r border-slate-200">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 font-semibold text-slate-700">
                              {log.activityType}
                            </span>
                          </td>
                          <td className="p-2 border-r border-slate-200 text-slate-600">{log.reqEstVolume}</td>
                          <td className="p-2 border-r border-slate-200 text-slate-600 truncate max-w-xs">{log.discussionOutcome}</td>
                          <td className="p-2 border-r border-slate-200 text-slate-700 font-medium">{log.nextAction}</td>
                          <td className="p-2 border-r border-slate-200 text-slate-600">{log.nextFollowUpDate}</td>
                          <td className="p-2 border-r border-slate-200 text-right text-slate-700">{formatUGX(log.quotationSubmittedValue)}</td>
                          <td className="p-2 border-r border-slate-200 text-right font-bold text-emerald-700">{formatUGX(log.orderReceivedValue)}</td>
                          <td className="p-2 border-r border-slate-200 text-right font-bold text-emerald-800">{formatUGX(log.cashCollected)}</td>
                          <td className="p-2 border-r border-slate-200 text-slate-600 truncate max-w-xs">{log.marketIntel}</td>
                          <td className="p-2 border-r border-slate-200 text-slate-600 truncate max-w-xs">{log.mgmtSupportNeeded}</td>
                          <td className="p-2 border-r border-slate-200 text-slate-700">{log.respDept}</td>
                          <td className="p-2 border-r border-slate-200 text-slate-600">{log.requiredByDate}</td>
                          <td className="p-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.issueStatus === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                              log.issueStatus === 'On Hold' ? 'bg-amber-100 text-amber-800' :
                              'bg-sky-100 text-sky-800'
                            }`}>
                              {log.issueStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: WEEKLY REPORT (5 Key Executive Sections)           */}
          {/* ======================================================== */}
          {activeTab === 'weekly' && (
            <div className="space-y-8">
              
              {/* Date Range Selector Header */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Executive Weekly Intelligence Report</h2>
                  <p className="text-xs text-slate-500">Consolidated weekly metrics, active deals, intel & bottleneck logs</p>
                </div>
                <div className="flex items-center space-x-3 text-xs bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-600">Start Date (Mon):</span>
                    <input
                      type="date"
                      value={weeklyStartDate}
                      onChange={(e) => setWeeklyStartDate(e.target.value)}
                      className="border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none"
                    />
                  </div>
                  <span className="text-slate-400">to</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-600">End Date (Sat):</span>
                    <input
                      type="date"
                      value={weeklyEndDate}
                      onChange={(e) => setWeeklyEndDate(e.target.value)}
                      className="border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {weeklyReportLoading && (
                <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
                  Loading the live weekly report...
                </div>
              )}
              {weeklyReportError && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  {weeklyReportError}
                </div>
              )}

              {weeklyReport && (
                <div className="space-y-8">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-3 bg-sky-700 text-white font-bold text-sm uppercase tracking-wide flex justify-between">
                      <span>LIVE API REPORT: SALES PERFORMANCE</span>
                      <span className="text-xs font-normal text-sky-200">{weeklyReport.period || 'weekly'}</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-slate-100 text-slate-800 font-bold">
                          <tr>
                            <th className="p-2.5 border-r border-slate-200">Metric</th>
                            {(weeklyReport.sales_performance?.salespersons || []).map(rep => (
                              <th key={rep} className="p-2.5 text-center border-r border-slate-200">{rep}</th>
                            ))}
                            <th className="p-2.5 text-center bg-slate-800 text-white">TOTAL TEAM</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {(weeklyReport.sales_performance?.rows || []).map(row => (
                            <tr key={row.key}>
                              <td className="p-2.5 border-r border-slate-200 font-medium">{row.metric}</td>
                              {(weeklyReport.sales_performance?.salespersons || []).map(rep => {
                                const value = row.per_salesperson?.[rep] || 0;
                                return <td key={rep} className="p-2.5 text-center border-r border-slate-200">{row.is_currency ? formatUGX(value) : value}</td>;
                              })}
                              <td className="p-2.5 text-center bg-slate-100 font-bold">{row.is_currency ? formatUGX(row.total_team) : row.total_team}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="p-3 bg-cyan-800 text-white font-bold text-sm uppercase">TOP ACTIVE SALES OPPORTUNITIES</div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead className="bg-slate-100 font-bold"><tr><th className="p-2.5">Customer</th><th className="p-2.5">Salesperson</th><th className="p-2.5">Stage</th><th className="p-2.5 text-right">Value</th></tr></thead>
                          <tbody className="divide-y divide-slate-200">
                            {(weeklyReport.top_opportunities || []).map(item => (
                              <tr key={item.id}><td className="p-2.5 font-bold text-sky-900">{item.customer}</td><td className="p-2.5">{item.salesperson}</td><td className="p-2.5">{item.sales_stage}</td><td className="p-2.5 text-right font-semibold">{formatUGX(item.potential_value_ugx)}</td></tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="p-3 bg-amber-700 text-white font-bold text-sm uppercase">MARKET INTELLIGENCE</div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead className="bg-slate-100 font-bold"><tr><th className="p-2.5">Date</th><th className="p-2.5">Salesperson</th><th className="p-2.5">Customer</th><th className="p-2.5">Information</th></tr></thead>
                          <tbody className="divide-y divide-slate-200">
                            {(weeklyReport.market_intelligence || []).map((item, index) => <tr key={item.id || index}><td className="p-2.5">{item.date}</td><td className="p-2.5">{item.salesperson}</td><td className="p-2.5 font-semibold">{item.customer || item.customer_company}</td><td className="p-2.5">{item.market_intelligence || item.market_competitor_intelligence || item.information}</td></tr>)}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="p-3 bg-purple-800 text-white font-bold text-sm uppercase">MANAGEMENT DELAYS</div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead className="bg-slate-100 font-bold"><tr><th className="p-2.5">Customer</th><th className="p-2.5">Salesperson</th><th className="p-2.5">Support Needed</th><th className="p-2.5">Status</th></tr></thead>
                          <tbody className="divide-y divide-slate-200">
                            {(weeklyReport.management_delays || []).map((item, index) => <tr key={item.id || index}><td className="p-2.5 font-semibold">{item.customer || item.customer_company}</td><td className="p-2.5">{item.salesperson}</td><td className="p-2.5">{item.management_support_needed || item.support_needed}</td><td className="p-2.5">{item.issue_status || item.status}</td></tr>)}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="p-3 bg-rose-800 text-white font-bold text-sm uppercase">ORDERS LOST</div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead className="bg-slate-100 font-bold"><tr><th className="p-2.5">Customer</th><th className="p-2.5">Salesperson</th><th className="p-2.5">Reason</th><th className="p-2.5">Value</th></tr></thead>
                          <tbody className="divide-y divide-slate-200">
                            {(weeklyReport.orders_lost || []).map((item, index) => <tr key={item.id || index}><td className="p-2.5 font-semibold">{item.customer || item.customer_company}</td><td className="p-2.5">{item.salesperson}</td><td className="p-2.5">{item.reason_lost || item.reason}</td><td className="p-2.5">{formatUGX(item.potential_value_ugx || item.value_ugx)}</td></tr>)}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 1: WEEKLY SALES PERFORMANCE REPORT (Matrix) */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-3 bg-sky-700 text-white font-bold text-sm uppercase tracking-wide flex justify-between items-center">
                  <span>SECTION 1: WEEKLY SALES PERFORMANCE REPORT</span>
                  <span className="text-xs font-normal text-sky-200">Per Salesperson Matrix</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 border-b border-slate-200 font-bold">
                        <th className="p-2.5 border-r border-slate-200 w-1/3">Performance Indicator Metric</th>
                        {salespersons.map(rep => (
                          <th key={rep} className="p-2.5 text-center border-r border-slate-200">{rep}</th>
                        ))}
                        <th className="p-2.5 text-center bg-slate-800 text-white">TOTAL TEAM</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      <tr>
                        <td className="p-2.5 border-r border-slate-200 text-slate-800">Physical Visits</td>
                        {salespersons.map(rep => {
                          const val = activityData.filter(a => a.salesperson === rep && a.activityType === 'Physical Visit').length;
                          return <td key={rep} className="p-2.5 text-center border-r border-slate-200">{val}</td>;
                        })}
                        <td className="p-2.5 text-center bg-slate-100 font-bold">
                          {activityData.filter(a => a.activityType === 'Physical Visit').length}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 border-r border-slate-200 text-slate-800">New Prospects Identified</td>
                        {salespersons.map(rep => {
                          const val = activityData.filter(a => a.salesperson === rep && a.prospectStatus === 'New Prospect Identified').length;
                          return <td key={rep} className="p-2.5 text-center border-r border-slate-200">{val}</td>;
                        })}
                        <td className="p-2.5 text-center bg-slate-100 font-bold">
                          {activityData.filter(a => a.prospectStatus === 'New Prospect Identified').length}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 border-r border-slate-200 text-slate-800">Existing Customer Visits</td>
                        {salespersons.map(rep => {
                          const val = activityData.filter(a => a.salesperson === rep && a.prospectStatus === 'Existing Customer').length;
                          return <td key={rep} className="p-2.5 text-center border-r border-slate-200">{val}</td>;
                        })}
                        <td className="p-2.5 text-center bg-slate-100 font-bold">
                          {activityData.filter(a => a.prospectStatus === 'Existing Customer').length}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 border-r border-slate-200 text-slate-800">Follow-up Interactions</td>
                        {salespersons.map(rep => {
                          const val = activityData.filter(a => a.salesperson === rep && a.activityType === 'Follow-up Interaction').length;
                          return <td key={rep} className="p-2.5 text-center border-r border-slate-200">{val}</td>;
                        })}
                        <td className="p-2.5 text-center bg-slate-100 font-bold">
                          {activityData.filter(a => a.activityType === 'Follow-up Interaction').length}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 border-r border-slate-200 text-slate-800">Samples Delivered / Trials</td>
                        {salespersons.map(rep => {
                          const val = pipelineData.filter(p => p.salesperson === rep && p.sampleStatus !== 'Not Started').length;
                          return <td key={rep} className="p-2.5 text-center border-r border-slate-200">{val}</td>;
                        })}
                        <td className="p-2.5 text-center bg-slate-100 font-bold">
                          {pipelineData.filter(p => p.sampleStatus !== 'Not Started').length}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 border-r border-slate-200 text-slate-800">Quotations Submitted (#)</td>
                        {salespersons.map(rep => {
                          const val = pipelineData.filter(p => p.salesperson === rep && p.quotationNo !== '').length;
                          return <td key={rep} className="p-2.5 text-center border-r border-slate-200">{val}</td>;
                        })}
                        <td className="p-2.5 text-center bg-slate-100 font-bold">
                          {pipelineData.filter(p => p.quotationNo !== '').length}
                        </td>
                      </tr>
                      <tr className="bg-sky-50/50">
                        <td className="p-2.5 border-r border-slate-200 font-bold text-sky-900">Quotation Value (UGX)</td>
                        {salespersons.map(rep => {
                          const val = pipelineData.filter(p => p.salesperson === rep).reduce((s, i) => s + Number(i.quotationValue || 0), 0);
                          return <td key={rep} className="p-2.5 text-center border-r border-slate-200 font-bold">{formatUGX(val)}</td>;
                        })}
                        <td className="p-2.5 text-center bg-sky-100 font-extrabold text-sky-900">
                          {formatUGX(pipelineData.reduce((s, i) => s + Number(i.quotationValue || 0), 0))}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 border-r border-slate-200 text-slate-800">Orders Confirmed (#)</td>
                        {salespersons.map(rep => {
                          const val = pipelineData.filter(p => p.salesperson === rep && p.salesStage === 'Order Won').length;
                          return <td key={rep} className="p-2.5 text-center border-r border-slate-200 font-bold text-emerald-700">{val}</td>;
                        })}
                        <td className="p-2.5 text-center bg-slate-100 font-bold text-emerald-800">
                          {pipelineData.filter(p => p.salesStage === 'Order Won').length}
                        </td>
                      </tr>
                      <tr className="bg-emerald-50/60">
                        <td className="p-2.5 border-r border-slate-200 font-bold text-emerald-900">Order Value Won (UGX)</td>
                        {salespersons.map(rep => {
                          const val = pipelineData.filter(p => p.salesperson === rep && p.salesStage === 'Order Won')
                            .reduce((s, i) => s + Number(i.actualOrderValue || i.estValue || 0), 0);
                          return <td key={rep} className="p-2.5 text-center border-r border-slate-200 font-bold text-emerald-800">{formatUGX(val)}</td>;
                        })}
                        <td className="p-2.5 text-center bg-emerald-200 font-extrabold text-emerald-950">
                          {formatUGX(metrics.totalOrderValueUGX)}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 border-r border-slate-200 text-slate-800">Cash Collections (UGX)</td>
                        {salespersons.map(rep => {
                          const val = activityData.filter(a => a.salesperson === rep).reduce((s, i) => s + Number(i.cashCollected || 0), 0);
                          return <td key={rep} className="p-2.5 text-center border-r border-slate-200 font-semibold">{formatUGX(val)}</td>;
                        })}
                        <td className="p-2.5 text-center bg-slate-100 font-bold text-slate-900">
                          {formatUGX(metrics.cashCollectedUGX)}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 border-r border-slate-200 text-pink-700 font-semibold">Active Overdue Follow-ups</td>
                        {salespersons.map(rep => {
                          const val = pipelineData.filter(p => p.salesperson === rep && p.followUpStatus === 'Overdue').length;
                          return <td key={rep} className="p-2.5 text-center border-r border-slate-200 font-bold text-pink-700">{val}</td>;
                        })}
                        <td className="p-2.5 text-center bg-pink-100 font-bold text-pink-900">
                          {metrics.overdueFollowUps}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 2: TOP ACTIVE SALES OPPORTUNITIES THIS WEEK */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-3 bg-cyan-800 text-white font-bold text-sm uppercase tracking-wide">
                  SECTION 2: TOP ACTIVE SALES OPPORTUNITIES THIS WEEK
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                        <th className="p-2.5 border-r border-slate-200">Customer</th>
                        <th className="p-2.5 border-r border-slate-200">Salesperson</th>
                        <th className="p-2.5 border-r border-slate-200">Product</th>
                        <th className="p-2.5 border-r border-slate-200 text-right">Potential Value (UGX)</th>
                        <th className="p-2.5 border-r border-slate-200">Current Sales Stage</th>
                        <th className="p-2.5 border-r border-slate-200">Next Action</th>
                        <th className="p-2.5">Follow-up Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="hover:bg-slate-50">
                        <td className="p-2.5 border-r border-slate-200 font-bold text-sky-900">ZY</td>
                        <td className="p-2.5 border-r border-slate-200 font-medium">Haidare Karrar</td>
                        <td className="p-2.5 border-r border-slate-200">Customized Printed Polythene Bags</td>
                        <td className="p-2.5 border-r border-slate-200 text-right font-bold text-slate-800">10,000,000</td>
                        <td className="p-2.5 border-r border-slate-200"><span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded">Requirement Identified</span></td>
                        <td className="p-2.5 border-r border-slate-200">Follow up</td>
                        <td className="p-2.5 font-medium">15/09/2026</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-2.5 border-r border-slate-200 font-bold text-sky-900">abc</td>
                        <td className="p-2.5 border-r border-slate-200 font-medium">Pouline Bwogi</td>
                        <td className="p-2.5 border-r border-slate-200">Customized Printed Polythene Bags</td>
                        <td className="p-2.5 border-r border-slate-200 text-right font-bold text-slate-800">1,000,000</td>
                        <td className="p-2.5 border-r border-slate-200"><span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded">New Lead</span></td>
                        <td className="p-2.5 border-r border-slate-200">Follow up</td>
                        <td className="p-2.5 font-medium">12/09/2026</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-2.5 border-r border-slate-200 font-bold text-sky-900">XX</td>
                        <td className="p-2.5 border-r border-slate-200 font-medium">Rogers Wandera</td>
                        <td className="p-2.5 border-r border-slate-200">Customized Printed Polythene Bags</td>
                        <td className="p-2.5 border-r border-slate-200 text-right font-bold text-slate-800">1,000</td>
                        <td className="p-2.5 border-r border-slate-200"><span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded">Quotation Sent</span></td>
                        <td className="p-2.5 border-r border-slate-200">Follow up</td>
                        <td className="p-2.5 font-medium">10/09/2026</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-2.5 border-r border-slate-200 font-bold text-sky-900">LMN</td>
                        <td className="p-2.5 border-r border-slate-200 font-medium">Rogers Wandera</td>
                        <td className="p-2.5 border-r border-slate-200">Customized Printed Polythene Bags</td>
                        <td className="p-2.5 border-r border-slate-200 text-right font-bold text-slate-800">10</td>
                        <td className="p-2.5 border-r border-slate-200"><span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded">Negotiation</span></td>
                        <td className="p-2.5 border-r border-slate-200">Follow up</td>
                        <td className="p-2.5 font-medium">10/09/2026</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 3: COMPETITOR / RAW MATERIAL / PRICE INTELLIGENCE NOTICED */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-3 bg-amber-700 text-white font-bold text-sm uppercase tracking-wide flex items-center justify-between">
                  <span>SECTION 3: COMPETITOR / RAW MATERIAL / PRICE INTELLIGENCE NOTICED</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                        <th className="p-2.5 border-r border-slate-200">Date</th>
                        <th className="p-2.5 border-r border-slate-200">Salesperson</th>
                        <th className="p-2.5 border-r border-slate-200">Customer</th>
                        <th className="p-2.5 border-r border-slate-200">Area / Location</th>
                        <th className="p-2.5 border-r border-slate-200">Market / Competitor Information</th>
                        <th className="p-2.5">Recommended Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="hover:bg-slate-50">
                        <td className="p-2.5 border-r border-slate-200 whitespace-nowrap">08/09/2026</td>
                        <td className="p-2.5 border-r border-slate-200 font-medium">Haidare Karrar</td>
                        <td className="p-2.5 border-r border-slate-200 font-bold text-slate-800">XYZ</td>
                        <td className="p-2.5 border-r border-slate-200">Kampala</td>
                        <td className="p-2.5 border-r border-slate-200 text-slate-700">Competitor is offering Shopping at 7501</td>
                        <td className="p-2.5 text-slate-800 font-medium">Compare competitor's UGX 7,501 price with our current selling price.</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-2.5 border-r border-slate-200 whitespace-nowrap">07/09/2026</td>
                        <td className="p-2.5 border-r border-slate-200 font-medium">Pouline Bwogi</td>
                        <td className="p-2.5 border-r border-slate-200 font-bold text-slate-800">ABC</td>
                        <td className="p-2.5 border-r border-slate-200">Kampala</td>
                        <td className="p-2.5 border-r border-slate-200 text-slate-700">Competitor is offering Shopping at 7500</td>
                        <td className="p-2.5 text-slate-800 font-medium">Check raw material sourcing cost</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 4: MANAGEMENT / PRODUCTION / SAMPLE DELAYS TO RESOLVE */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-3 bg-purple-800 text-white font-bold text-sm uppercase tracking-wide flex justify-between items-center">
                  <span>SECTION 4: MANAGEMENT / PRODUCTION / SAMPLE DELAYS TO RESOLVE</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                        <th className="p-2.5 border-r border-slate-200">Date</th>
                        <th className="p-2.5 border-r border-slate-200">Customer / Company</th>
                        <th className="p-2.5 border-r border-slate-200">Sales Person</th>
                        <th className="p-2.5 border-r border-slate-200">Support / Issue Required</th>
                        <th className="p-2.5 border-r border-slate-200">Responsible Person / Dept.</th>
                        <th className="p-2.5 border-r border-slate-200">Required by Date / Deadline</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="hover:bg-slate-50">
                        <td className="p-2.5 border-r border-slate-200 whitespace-nowrap">08/09/2026</td>
                        <td className="p-2.5 border-r border-slate-200 font-bold text-sky-900">XYZ</td>
                        <td className="p-2.5 border-r border-slate-200 font-medium">Haidare Karrar</td>
                        <td className="p-2.5 border-r border-slate-200 text-slate-700">Make the trial Sample as per customer's sample</td>
                        <td className="p-2.5 border-r border-slate-200 font-semibold text-slate-800">Production</td>
                        <td className="p-2.5 border-r border-slate-200 font-medium">16/09/2026</td>
                        <td className="p-2.5">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Resolved
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-2.5 border-r border-slate-200 whitespace-nowrap">07/09/2026</td>
                        <td className="p-2.5 border-r border-slate-200 font-bold text-sky-900">ABC</td>
                        <td className="p-2.5 border-r border-slate-200 font-medium">Pouline Bwogi</td>
                        <td className="p-2.5 border-r border-slate-200 text-slate-700">Prepare Sample</td>
                        <td className="p-2.5 border-r border-slate-200 font-semibold text-slate-800">Production</td>
                        <td className="p-2.5 border-r border-slate-200 font-medium">20/09/2026</td>
                        <td className="p-2.5">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            On Hold
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 5: ORDERS LOST & ROOT CAUSE ANALYSIS */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-3 bg-rose-800 text-white font-bold text-sm uppercase tracking-wide">
                  SECTION 5: ORDERS LOST & ROOT CAUSE ANALYSIS
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                        <th className="p-2.5 border-r border-slate-200">Customer / Company</th>
                        <th className="p-2.5 border-r border-slate-200">Salesperson</th>
                        <th className="p-2.5 border-r border-slate-200">Product / Service</th>
                        <th className="p-2.5 border-r border-slate-200 text-right">Potential Value (UGX)</th>
                        <th className="p-2.5 border-r border-slate-200">Reason Lost</th>
                        <th className="p-2.5 border-r border-slate-200">Competitor / Supplier</th>
                        <th className="p-2.5">Corrective Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="hover:bg-slate-50">
                        <td className="p-2.5 border-r border-slate-200 font-bold text-rose-900">abc</td>
                        <td className="p-2.5 border-r border-slate-200 font-medium">Pouline Bwogi</td>
                        <td className="p-2.5 border-r border-slate-200">Customized Printed Polythene Bags</td>
                        <td className="p-2.5 border-r border-slate-200 text-right font-bold text-slate-800">500</td>
                        <td className="p-2.5 border-r border-slate-200 text-rose-700 font-semibold">High Price</td>
                        <td className="p-2.5 border-r border-slate-200 font-medium text-slate-700">KKDR</td>
                        <td className="p-2.5 text-slate-800 font-medium">Try alternative contact/procurement person</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: MASTER LISTS CONFIGURATION                         */}
          {/* ======================================================== */}
          {activeTab === 'lists' && (
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-base font-bold text-slate-900">Master Dropdown Value Configurations</h2>
                <p className="text-xs text-slate-500">Add or manage system dropdown items utilized across Pipeline and Daily Logs</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Salespersons List */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-sm text-slate-800 pb-2 border-b border-slate-200 flex items-center justify-between">
                    <span>Sales Representatives</span>
                    <span className="text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">{salespersons.length}</span>
                  </h3>
                  <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                    {salespersons.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded border border-slate-100">
                        <span className="font-medium text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      placeholder="Add Sales Rep..."
                      value={newListInputs.salesperson}
                      onChange={(e) => setNewListInputs({ ...newListInputs, salesperson: e.target.value })}
                      className="flex-1 text-xs border border-slate-300 rounded p-1.5 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        if (newListInputs.salesperson.trim()) {
                          setSalespersons([...salespersons, newListInputs.salesperson.trim()]);
                          setNewListInputs({ ...newListInputs, salesperson: '' });
                        }
                      }}
                      className="bg-sky-600 text-white text-xs px-3 py-1.5 rounded font-medium hover:bg-sky-700"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Sales Stages List */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-sm text-slate-800 pb-2 border-b border-slate-200 flex items-center justify-between">
                    <span>Sales Pipeline Stages</span>
                    <span className="text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">{salesStages.length}</span>
                  </h3>
                  <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                    {salesStages.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded border border-slate-100">
                        <span className="font-medium text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      placeholder="Add Stage..."
                      value={newListInputs.salesStage}
                      onChange={(e) => setNewListInputs({ ...newListInputs, salesStage: e.target.value })}
                      className="flex-1 text-xs border border-slate-300 rounded p-1.5 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        if (newListInputs.salesStage.trim()) {
                          setSalesStages([...salesStages, newListInputs.salesStage.trim()]);
                          setNewListInputs({ ...newListInputs, salesStage: '' });
                        }
                      }}
                      className="bg-sky-600 text-white text-xs px-3 py-1.5 rounded font-medium hover:bg-sky-700"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Customer Types List */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-sm text-slate-800 pb-2 border-b border-slate-200 flex items-center justify-between">
                    <span>Customer Types</span>
                    <span className="text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">{customerTypes.length}</span>
                  </h3>
                  <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                    {customerTypes.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded border border-slate-100">
                        <span className="font-medium text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      placeholder="Add Customer Type..."
                      value={newListInputs.customerType}
                      onChange={(e) => setNewListInputs({ ...newListInputs, customerType: e.target.value })}
                      className="flex-1 text-xs border border-slate-300 rounded p-1.5 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        if (newListInputs.customerType.trim()) {
                          setCustomerTypes([...customerTypes, newListInputs.customerType.trim()]);
                          setNewListInputs({ ...newListInputs, customerType: '' });
                        }
                      }}
                      className="bg-sky-600 text-white text-xs px-3 py-1.5 rounded font-medium hover:bg-sky-700"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Departments List */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-sm text-slate-800 pb-2 border-b border-slate-200 flex items-center justify-between">
                    <span>Departments</span>
                    <span className="text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">{departments.length}</span>
                  </h3>
                  <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                    {departments.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded border border-slate-100">
                        <span className="font-medium text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      placeholder="Add Dept..."
                      value={newListInputs.department}
                      onChange={(e) => setNewListInputs({ ...newListInputs, department: e.target.value })}
                      className="flex-1 text-xs border border-slate-300 rounded p-1.5 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        if (newListInputs.department.trim()) {
                          setDepartments([...departments, newListInputs.department.trim()]);
                          setNewListInputs({ ...newListInputs, department: '' });
                        }
                      }}
                      className="bg-sky-600 text-white text-xs px-3 py-1.5 rounded font-medium hover:bg-sky-700"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Issue Statuses List */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-sm text-slate-800 pb-2 border-b border-slate-200 flex items-center justify-between">
                    <span>Issue Status Options</span>
                    <span className="text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">{issueStatuses.length}</span>
                  </h3>
                  <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                    {issueStatuses.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded border border-slate-100">
                        <span className="font-medium text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      placeholder="Add Issue Status..."
                      value={newListInputs.issueStatus}
                      onChange={(e) => setNewListInputs({ ...newListInputs, issueStatus: e.target.value })}
                      className="flex-1 text-xs border border-slate-300 rounded p-1.5 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        if (newListInputs.issueStatus.trim()) {
                          setIssueStatuses([...issueStatuses, newListInputs.issueStatus.trim()]);
                          setNewListInputs({ ...newListInputs, issueStatus: '' });
                        }
                      }}
                      className="bg-sky-600 text-white text-xs px-3 py-1.5 rounded font-medium hover:bg-sky-700"
                    >
                      Add
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

      {/* ======================================================== */}
      {/* MODALS & OVERLAYS                                        */}
      {/* ======================================================== */}

      {/* PIPELINE ADD / EDIT MODAL */}
      {isPipelineModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 bg-sky-800 text-white flex justify-between items-center">
              <h3 className="font-bold text-base">
                {pipelineForm.id ? `Edit Customer Prospect: ${pipelineForm.prospectId || pipelineForm.id}` : 'Add New Customer Prospect'}
              </h3>
              <button onClick={() => setIsPipelineModalOpen(false)} className="hover:bg-sky-700 p-1 rounded">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePipeline} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Salesperson *</label>
                  <select
                    value={pipelineForm.salesperson}
                    onChange={(e) => setPipelineForm({ ...pipelineForm, salesperson: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-sky-500"
                    required
                  >
                    {salespersons.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer / Company *</label>
                  <input
                    type="text"
                    value={pipelineForm.customer}
                    onChange={(e) => setPipelineForm({ ...pipelineForm, customer: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location / Town</label>
                  <input
                    type="text"
                    value={pipelineForm.location}
                    onChange={(e) => setPipelineForm({ ...pipelineForm, location: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={pipelineForm.contactPerson}
                    onChange={(e) => setPipelineForm({ ...pipelineForm, contactPerson: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Telephone</label>
                  <input
                    type="text"
                    value={pipelineForm.telephone}
                    onChange={(e) => setPipelineForm({ ...pipelineForm, telephone: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Type</label>
                  <select
                    value={pipelineForm.customerType}
                    onChange={(e) => setPipelineForm({ ...pipelineForm, customerType: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                  >
                    {customerTypes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Product / Service</label>
                  <select
                    value={pipelineForm.product}
                    onChange={(e) => setPipelineForm({ ...pipelineForm, product: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                  >
                    {INITIAL_PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Est Quantity</label>
                  <input
                    type="text"
                    value={pipelineForm.estQty}
                    onChange={(e) => setPipelineForm({ ...pipelineForm, estQty: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Est Value (UGX)</label>
                  <input
                    type="number"
                    value={pipelineForm.estValue}
                    onChange={(e) => setPipelineForm({ ...pipelineForm, estValue: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sales Stage</label>
                  <select
                    value={pipelineForm.salesStage}
                    onChange={(e) => setPipelineForm({ ...pipelineForm, salesStage: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                  >
                    {salesStages.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Next Follow-up Date</label>
                  <input
                    type="date"
                    value={pipelineForm.nextFollowUpDate}
                    onChange={(e) => setPipelineForm({ ...pipelineForm, nextFollowUpDate: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Follow-up Status</label>
                  <select
                    value={pipelineForm.followUpStatus}
                    onChange={(e) => setPipelineForm({ ...pipelineForm, followUpStatus: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Requirements / Specifications</label>
                <textarea
                  rows="2"
                  value={pipelineForm.specs}
                  onChange={(e) => setPipelineForm({ ...pipelineForm, specs: e.target.value })}
                  className="w-full border border-slate-300 rounded p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Next Action</label>
                <input
                  type="text"
                  value={pipelineForm.nextAction}
                  onChange={(e) => setPipelineForm({ ...pipelineForm, nextAction: e.target.value })}
                  className="w-full border border-slate-300 rounded p-2"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsPipelineModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-600 font-medium hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded font-medium hover:bg-sky-700"
                >
                  Save Prospect Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DAILY ACTIVITY LOG MODAL */}
      {isActivityModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 bg-sky-800 text-white flex justify-between items-center">
              <h3 className="font-bold text-base">
                {activityForm.id ? `Edit Daily Log: ${activityForm.id}` : 'Log New Daily Field Activity'}
              </h3>
              <button onClick={() => setIsActivityModalOpen(false)} className="hover:bg-sky-700 p-1 rounded">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveActivity} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={activityForm.date}
                    onChange={(e) => setActivityForm({ ...activityForm, date: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Salesperson</label>
                  <select
                    value={activityForm.salesperson}
                    onChange={(e) => setActivityForm({ ...activityForm, salesperson: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                  >
                    {salespersons.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Area / Route Visited</label>
                  <input
                    type="text"
                    value={activityForm.areaRoute}
                    onChange={(e) => setActivityForm({ ...activityForm, areaRoute: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer / Company</label>
                  <input
                    type="text"
                    value={activityForm.customer}
                    onChange={(e) => setActivityForm({ ...activityForm, customer: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Activity Type</label>
                  <select
                    value={activityForm.activityType}
                    onChange={(e) => setActivityForm({ ...activityForm, activityType: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                  >
                    <option value="Physical Visit">Physical Visit</option>
                    <option value="Follow-up Interaction">Follow-up Interaction</option>
                    <option value="Phone Call">Phone Call</option>
                    <option value="Email Quote">Email Quote</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Issue Status</label>
                  <select
                    value={activityForm.issueStatus}
                    onChange={(e) => setActivityForm({ ...activityForm, issueStatus: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                  >
                    {issueStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cash Collected (UGX)</label>
                  <input
                    type="number"
                    value={activityForm.cashCollected}
                    onChange={(e) => setActivityForm({ ...activityForm, cashCollected: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Discussion / Outcome</label>
                <textarea
                  rows="2"
                  value={activityForm.discussionOutcome}
                  onChange={(e) => setActivityForm({ ...activityForm, discussionOutcome: e.target.value })}
                  className="w-full border border-slate-300 rounded p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Market / Competitor Intelligence</label>
                <textarea
                  rows="2"
                  value={activityForm.marketIntel}
                  onChange={(e) => setActivityForm({ ...activityForm, marketIntel: e.target.value })}
                  className="w-full border border-slate-300 rounded p-2"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsActivityModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-600 font-medium hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded font-medium hover:bg-sky-700"
                >
                  Save Activity Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSalespersonModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 bg-sky-800 text-white flex justify-between items-center">
              <h3 className="font-bold text-base">
                {salespersonForm.id ? `Edit Salesperson: ${salespersonForm.name}` : 'Add New Salesperson'}
              </h3>
              <button onClick={() => setIsSalespersonModalOpen(false)} className="hover:bg-sky-700 p-1 rounded">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSalesperson} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={salespersonForm.name}
                    onChange={(e) => setSalespersonForm({ ...salespersonForm, name: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={salespersonForm.email}
                    onChange={(e) => setSalespersonForm({ ...salespersonForm, email: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={salespersonForm.phone}
                    onChange={(e) => setSalespersonForm({ ...salespersonForm, phone: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={salespersonForm.department}
                    onChange={(e) => setSalespersonForm({ ...salespersonForm, department: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                  >
                    {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Active</label>
                  <select
                    value={salespersonForm.is_active ? 'true' : 'false'}
                    onChange={(e) => setSalespersonForm({ ...salespersonForm, is_active: e.target.value === 'true' })}
                    className="w-full border border-slate-300 rounded p-2"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsSalespersonModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-600 font-medium hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded font-medium hover:bg-sky-700"
                >
                  Save Salesperson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSalespersonDetailModalOpen && selectedSalespersonItem && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden text-xs">
            <div className="p-4 bg-sky-900 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm">{selectedSalespersonItem.name}</h3>
                <p className="text-[11px] text-sky-200">Salesperson ID: {selectedSalespersonItem.id}</p>
              </div>
              <button onClick={() => setIsSalespersonDetailModalOpen(false)} className="hover:bg-sky-800 p-1 rounded">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-slate-400">Email:</span>
                  <p className="font-semibold text-slate-800">{selectedSalespersonItem.email || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-slate-400">Phone:</span>
                  <p className="font-semibold text-slate-800">{selectedSalespersonItem.phone || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-slate-400">Department:</span>
                  <p className="font-semibold text-slate-800">{selectedSalespersonItem.department || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-slate-400">Status:</span>
                  <p className="font-semibold text-slate-800">{selectedSalespersonItem.is_active ? 'Active' : 'Inactive'}</p>
                </div>
              </div>

              <div>
                <span className="text-slate-400">Created At:</span>
                <p className="font-semibold text-slate-800">{selectedSalespersonItem.created_at ? new Date(selectedSalespersonItem.created_at).toLocaleString() : 'N/A'}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsSalespersonDetailModalOpen(false)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded font-medium hover:bg-slate-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL EYE MODAL FOR PIPELINE */}
      {isDetailModalOpen && selectedPipelineItem && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden text-xs">
            <div className="p-4 bg-sky-900 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm">{selectedPipelineItem.customer}</h3>
                <p className="text-[11px] text-sky-200">Prospect ID: {selectedPipelineItem.prospectId || selectedPipelineItem.id} | Record ID: {selectedPipelineItem.id} | Rep: {selectedPipelineItem.salesperson}</p>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="hover:bg-sky-800 p-1 rounded">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 border-b border-slate-100 pb-3">
                <div><span className="text-slate-400">Location:</span> <p className="font-semibold text-slate-800">{selectedPipelineItem.location || 'N/A'}</p></div>
                <div><span className="text-slate-400">Contact:</span> <p className="font-semibold text-slate-800">{selectedPipelineItem.contactPerson} ({selectedPipelineItem.telephone})</p></div>
                <div><span className="text-slate-400">Customer Type:</span> <p className="font-semibold text-slate-800">{selectedPipelineItem.customerType}</p></div>
                <div><span className="text-slate-400">Product:</span> <p className="font-semibold text-slate-800">{selectedPipelineItem.product}</p></div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-b border-slate-100 pb-3">
                <div><span className="text-slate-400">Est. Quantity:</span> <p className="font-semibold text-slate-800">{selectedPipelineItem.estQty} {selectedPipelineItem.unit}</p></div>
                <div><span className="text-slate-400">Est. Value (UGX):</span> <p className="font-semibold text-sky-800">{formatUGX(selectedPipelineItem.estValue)}</p></div>
                <div><span className="text-slate-400">Sales Stage:</span> <p className="font-semibold text-slate-800">{selectedPipelineItem.salesStage}</p></div>
                <div><span className="text-slate-400">Follow-up Date:</span> <p className="font-semibold text-slate-800">{selectedPipelineItem.nextFollowUpDate}</p></div>
              </div>

              <div>
                <span className="text-slate-400">Requirements / Specs:</span>
                <p className="p-2 bg-slate-50 rounded border border-slate-100 mt-1 text-slate-700">{selectedPipelineItem.specs || 'None specified'}</p>
              </div>

              <div>
                <span className="text-slate-400">Last Discussion:</span>
                <p className="p-2 bg-slate-50 rounded border border-slate-100 mt-1 text-slate-700">{selectedPipelineItem.lastDiscussion || 'N/A'}</p>
              </div>

              <div>
                <span className="text-slate-400">Remarks / Management Notes:</span>
                <p className="p-2 bg-slate-50 rounded border border-slate-100 mt-1 text-slate-700">{selectedPipelineItem.remarks || 'No remarks recorded'}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded font-medium hover:bg-slate-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}