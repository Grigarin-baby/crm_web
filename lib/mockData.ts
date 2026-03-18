export const mockLeads = [
  { id: '1', firstName: 'John', lastName: 'Doe', company: 'TechCorp', email: 'john@techcorp.com', phone: '123-456-7890', status: 'NEW', source: 'Website', createdAt: '2026-03-10' },
  { id: '2', firstName: 'Jane', lastName: 'Smith', company: 'Global Solutions', email: 'jane@globalsol.com', phone: '098-765-4321', status: 'QUALIFIED', source: 'Referral', createdAt: '2026-03-12' },
  { id: '3', firstName: 'Michael', lastName: 'Brown', company: 'Innovate LLC', email: 'mike@innovate.com', phone: '555-555-5555', status: 'CONTACTED', source: 'LinkedIn', createdAt: '2026-03-15' },
];

export const mockCustomers = [
  { id: '1', name: 'Acme Corp', industry: 'Manufacturing', address: '123 Industrial Way', status: 'ACTIVE', createdAt: '2025-01-01' },
  { id: '2', name: 'Cyberdyne Systems', industry: 'Robotics', address: '456 Tech Park', status: 'ACTIVE', createdAt: '2025-02-15' },
];

export const mockContacts = [
  { id: '1', firstName: 'Sarah', lastName: 'Connor', email: 'sarah@cyberdyne.com', phone: '111-222-3333', role: 'Operations Manager', customerName: 'Cyberdyne Systems' },
  { id: '2', firstName: 'Robert', lastName: 'Patrick', email: 'robert@acme.com', phone: '444-555-6666', role: 'Purchasing Agent', customerName: 'Acme Corp' },
];

export const mockDeals = [
  { id: '1', name: 'Server Upgrade', value: 25000, stage: 'PROPOSAL', expectedCloseDate: '2026-04-30', customerName: 'Acme Corp' },
  { id: '2', name: 'Cloud Migration', value: 120000, stage: 'NEGOTIATION', expectedCloseDate: '2026-06-15', customerName: 'Cyberdyne Systems' },
];

export const mockProducts = [
  { id: '1', name: 'Premium Subscription', sku: 'SUB-PRM', price: 99.99, description: 'Monthly premium access' },
  { id: '2', name: 'Onboarding Service', sku: 'SRV-ONB', price: 500.00, description: 'One-time setup fee' },
];

export const mockVendors = [
  { id: '1', name: 'Global Tech Supplies', contactPerson: 'Alice Wang', email: 'alice@globaltech.com', phone: '555-0101', category: 'Hardware' },
  { id: '2', name: 'Cloud Services Inc', contactPerson: 'Bob Miller', email: 'bob@cloudservices.com', phone: '555-0102', category: 'Software' },
];

export const mockQuotes = [
  { id: '1', quoteNumber: 'Q-2026-001', totalAmount: 25000, validUntil: '2026-04-15', customerName: 'Acme Corp', dealName: 'Server Upgrade' },
];

export const mockSalesOrders = [
  { id: '1', orderNumber: 'SO-2026-501', orderStatus: 'CONFIRMED', paymentStatus: 'PAID', customerName: 'Acme Corp' },
];

export const mockPurchaseOrders = [
  { id: '1', poNumber: 'PO-2026-701', status: 'ISSUED', totalAmount: 5000, vendorName: 'Global Tech Supplies', expectedDate: '2026-04-10' },
];

export const mockInvoices = [
  { id: '1', invoiceNumber: 'INV-2026-901', amount: 25000, paymentStatus: 'PAID', invoiceDate: '2026-03-18', customerName: 'Acme Corp' },
];

export const mockTasks = [
  { id: '1', title: 'Follow up with Acme Corp', dueDate: '2026-03-20', status: 'TODO', priority: 'HIGH', assignedUser: 'John Admin' },
  { id: '2', title: 'Prepare proposal for Cloud Migration', dueDate: '2026-03-22', status: 'IN_PROGRESS', priority: 'MEDIUM', assignedUser: 'Jane Sales' },
];

export const mockTickets = [
  { id: '1', ticketId: 'TKT-1001', category: 'Technical', priority: 'URGENT', status: 'OPEN', customerName: 'Cyberdyne Systems', createdAt: '2026-03-18' },
  { id: '2', ticketId: 'TKT-1002', category: 'Billing', priority: 'LOW', status: 'CLOSED', customerName: 'Acme Corp', createdAt: '2026-03-15' },
];

export const mockMeetings = [
  { id: '1', title: 'Project Kickoff', date: '2026-04-01', location: 'Zoom', participants: 'John, Jane, Bob', notes: 'Initial project discussion', contactName: 'Sarah Connor' },
  { id: '2', title: 'Quarterly Review', date: '2026-04-15', location: 'Conference Room A', participants: 'Alice, Charlie', notes: 'Reviewing Q1 performance', contactName: 'Robert Patrick' },
];

export const mockCalls = [
  { id: '1', callType: 'Inbound', duration: 15, summary: 'Discussed pricing for server upgrade', contactName: 'Sarah Connor', createdAt: '2026-03-18' },
  { id: '2', callType: 'Outbound', duration: 10, summary: 'Follow up on proposal', contactName: 'Robert Patrick', createdAt: '2026-03-19' },
];
