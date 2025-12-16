// ==================== APPLICATION STATE ====================
let currentUser = null;
let users = [];
let employees = [];
let leaves = [];
let notifications = [];

// ==================== UTILITY FUNCTIONS ====================
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
}

function generateEmployeeId() {
    return 'emp_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

function showSuccess(message, title = 'Berhasil!') {
    document.getElementById('success-title').textContent = title;
    document.getElementById('success-message').textContent = message;
    openModal('modal-success');
}

function showConfirmation(message, title, callback) {
    document.getElementById('confirmation-title').textContent = title;
    document.getElementById('confirmation-message').textContent = message;
    
    const confirmBtn = document.getElementById('confirm-action');
    confirmBtn.onclick = function() {
        callback();
        closeModal('modal-confirmation');
    };
    
    openModal('modal-confirmation');
}

// ==================== INITIALIZATION ====================
function initializeUsers() {
    const storedUsers = localStorage.getItem('simpeg_users');
    
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    } else {
        // User default untuk demo
        users = [
            {
                id: generateUserId(),
                fullname: "Budi Santoso",
                username: "budi.santoso",
                email: "budi@simpeg.com",
                password: "budi123",
                role: "pegawai",
                nip: "EMP001",
                position: "Staff IT",
                phone: "081234567891",
                createdAt: new Date().toISOString(),
                lastLogin: null
            },
            {
                id: generateUserId(),
                fullname: "Siti Nurhaliza",
                username: "siti.nurhaliza",
                email: "siti@simpeg.com",
                password: "siti123",
                role: "pegawai",
                nip: "EMP002",
                position: "Manager HRD",
                phone: "081234567892",
                createdAt: new Date().toISOString(),
                lastLogin: null
            }
        ];
        
        saveUsers();
    }
    
    initializeEmployees();
}

function initializeEmployees() {
    const storedEmployees = localStorage.getItem('simpeg_employees');
    
    if (storedEmployees) {
        employees = JSON.parse(storedEmployees);
    } else {
        employees = users
            .filter(user => user.role === 'pegawai')
            .map(user => ({
                id: generateEmployeeId(),
                userId: user.id,
                fullname: user.fullname,
                nip: user.nip,
                position: user.position,
                department: getDepartmentByPosition(user.position),
                email: user.email,
                phone: user.phone,
                status: 'Aktif',
                joinDate: '2020-01-15'
            }));
        
        saveEmployees();
    }
}

function getDepartmentByPosition(position) {
    if (position.includes('IT')) return 'Teknologi Informasi';
    if (position.includes('HRD')) return 'Sumber Daya Manusia';
    if (position.includes('Keuangan')) return 'Keuangan';
    if (position.includes('Pemasaran')) return 'Pemasaran';
    return 'Operasional';
}

function initializeLeaves() {
    const storedLeaves = localStorage.getItem('simpeg_leaves');
    
    if (storedLeaves) {
        leaves = JSON.parse(storedLeaves);
    } else {
        leaves = [
            {
                id: 'leave_1',
                userId: users.find(u => u.username === 'budi.santoso')?.id || '',
                fullname: 'Budi Santoso',
                type: 'Cuti Tahunan',
                startDate: '2025-11-20',
                endDate: '2025-11-24',
                days: 5,
                reason: 'Liburan keluarga',
                status: 'pending',
                supervisor: 'Siti Nurhaliza',
                createdAt: new Date().toISOString()
            },
            {
                id: 'leave_2',
                userId: users.find(u => u.username === 'siti.nurhaliza')?.id || '',
                fullname: 'Siti Nurhaliza',
                type: 'Cuti Sakit',
                startDate: '2025-11-16',
                endDate: '2025-11-18',
                days: 3,
                reason: 'Flu dan demam',
                status: 'approved',
                supervisor: 'Administrator SIMPEG',
                createdAt: new Date('2025-11-10').toISOString()
            }
        ];
        
        saveLeaves();
    }
}

function initializeNotifications() {
    const storedNotifications = localStorage.getItem('simpeg_notifications');
    
    if (storedNotifications) {
        notifications = JSON.parse(storedNotifications);
    } else {
        notifications = [
            {
                id: 'notif_1',
                userId: 'all',
                title: '3 pegawai mendekati masa pensiun',
                message: 'Budi Santoso, Siti Nurhaliza, dan Ahmad Fauzi akan memasuki masa pensiun dalam 6 bulan ke depan.',
                type: 'important',
                read: false,
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'notif_2',
                userId: 'all',
                title: '5 pengajuan cuti menunggu persetujuan',
                message: 'Anda memiliki 5 pengajuan cuti yang belum diproses. Segera tinjau dan berikan persetujuan.',
                type: 'warning',
                read: false,
                createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'notif_3',
                userId: 'all',
                title: 'Periode penggajian akan dimulai besok',
                message: 'Persiapkan data presensi, lembur, dan tunjangan untuk proses penggajian bulan November 2025.',
                type: 'info',
                read: true,
                createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
            }
        ];
        
        saveNotifications();
    }
    
    updateNotificationBadges();
}

// ==================== DATA PERSISTENCE ====================
function saveUsers() {
    localStorage.setItem('simpeg_users', JSON.stringify(users));
}

function saveEmployees() {
    localStorage.setItem('simpeg_employees', JSON.stringify(employees));
}

function saveLeaves() {
    localStorage.setItem('simpeg_leaves', JSON.stringify(leaves));
}

function saveNotifications() {
    localStorage.setItem('simpeg_notifications', JSON.stringify(notifications));
    updateNotificationBadges();
}

// ==================== AUTHENTICATION ====================
function login(username, password) {
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        user.lastLogin = new Date().toISOString();
        saveUsers();
        
        currentUser = { ...user };
        delete currentUser.password;
        
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        return true;
    }
    
    return false;
}

function register(userData) {
    if (users.find(u => u.username === userData.username)) {
        return { success: false, message: 'Username sudah digunakan' };
    }
    
    if (users.find(u => u.email === userData.email)) {
        return { success: false, message: 'Email sudah terdaftar' };
    }
    
    const newUser = {
        id: generateUserId(),
        ...userData,
        createdAt: new Date().toISOString(),
        lastLogin: null
    };
    
    users.push(newUser);
    saveUsers();
    
    if (userData.role === 'pegawai') {
        const newEmployee = {
            id: generateEmployeeId(),
            userId: newUser.id,
            fullname: userData.fullname,
            nip: userData.nip || '',
            position: userData.position || 'Staff',
            department: getDepartmentByPosition(userData.position || 'Staff'),
            email: userData.email,
            phone: '',
            status: 'Aktif',
            joinDate: new Date().toISOString().split('T')[0]
        };
        
        employees.push(newEmployee);
        saveEmployees();
    }
    
    return { success: true, message: 'Pendaftaran berhasil' };
}

function logout() {
    currentUser = null;
    sessionStorage.removeItem('currentUser');
    showAuthPages();
}

function checkAuth() {
    const storedUser = sessionStorage.getItem('currentUser');
    
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showAppPages();
        return true;
    }
    
    return false;
}

// ==================== PAGE MANAGEMENT ====================
function showAuthPages() {
    document.getElementById('auth-container').classList.remove('hidden');
    document.getElementById('register-page').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('app-container').classList.remove('visible');
    document.getElementById('app-container').style.display = 'none';
}

function showAppPages() {
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('register-page').classList.add('hidden');
    document.getElementById('app-container').classList.add('visible');
    document.getElementById('app-container').style.display = 'flex';
    
    updateUserUI();
    loadDashboardData();
    
    if (currentUser.role === 'admin') {
        document.getElementById('employee-menu').classList.add('hidden');
        document.getElementById('admin-quick-actions').classList.remove('hidden');
        document.getElementById('employee-quick-actions').classList.add('hidden');
    } else {
        document.getElementById('employee-menu').classList.remove('hidden');
        document.getElementById('admin-quick-actions').classList.add('hidden');
        document.getElementById('employee-quick-actions').classList.remove('hidden');
    }
}

function updateUserUI() {
    if (!currentUser) return;
    
    const avatarText = currentUser.fullname.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    
    document.getElementById('user-avatar').textContent = avatarText;
    document.getElementById('user-fullname').textContent = currentUser.fullname;
    document.getElementById('user-role').textContent = currentUser.role === 'admin' ? 'Admin' : 'Pegawai';
    
    document.getElementById('top-user-avatar').textContent = avatarText;
    document.getElementById('top-user-fullname').textContent = currentUser.fullname;
    document.getElementById('top-user-role').textContent = currentUser.role === 'admin' ? 'Admin' : 'Pegawai';
    
    document.getElementById('profile-fullname').value = currentUser.fullname;
    document.getElementById('profile-email').value = currentUser.email;
    document.getElementById('profile-phone').value = currentUser.phone || '';
    document.getElementById('profile-nip').value = currentUser.nip || '';
    document.getElementById('profile-position').value = currentUser.position || '';
}

function loadDashboardData() {
    document.getElementById('total-employees').textContent = employees.length;
    document.getElementById('present-today').textContent = Math.floor(employees.length * 0.87);
    document.getElementById('on-leave').textContent = leaves.filter(l => l.status === 'approved' && 
        new Date(l.startDate) <= new Date() && new Date(l.endDate) >= new Date()).length;
    
    const totalPayroll = employees.length * 12500000;
    document.getElementById('total-payroll').textContent = `Rp ${(totalPayroll / 1000000).toFixed(1)}M`;
    
    updateNotificationBadges();
    
    if (currentUser.role === 'admin') {
        loadEmployeesTable();
        loadUsersTable();
    } else {
        loadMyLeavesTable();
    }
    
    loadNotifications();
    updateRecentActivities();
}

// ==================== NOTIFICATION BADGES ====================
function updateNotificationBadges() {
    const unreadCount = notifications.filter(n => 
        (n.userId === 'all' || n.userId === currentUser?.id) && !n.read
    ).length;
    
    // Hanya update badge di top bar
    document.getElementById('top-notification-count').textContent = unreadCount;
}

// ==================== UPDATE USER UI ====================
function updateUserUI() {
    if (!currentUser) return;
    
    const avatarText = currentUser.fullname.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    
    document.getElementById('user-avatar').textContent = avatarText;
    document.getElementById('user-fullname').textContent = currentUser.fullname;
    document.getElementById('user-role').textContent = currentUser.role === 'admin' ? 'Admin' : 'Pegawai';
    
    document.getElementById('top-user-avatar').textContent = avatarText;
    document.getElementById('top-user-fullname').textContent = currentUser.fullname;
    document.getElementById('top-user-role').textContent = currentUser.role === 'admin' ? 'Admin' : 'Pegawai';
    
    document.getElementById('profile-fullname').value = currentUser.fullname;
    document.getElementById('profile-email').value = currentUser.email;
    document.getElementById('profile-phone').value = currentUser.phone || '';
    document.getElementById('profile-nip').value = currentUser.nip || '';
    document.getElementById('profile-position').value = currentUser.position || '';
}



// ==================== TABLE DATA LOADING ====================
function loadEmployeesTable() {
    const tbody = document.getElementById('employees-table');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    employees.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.nip || '-'}</td>
            <td>${employee.fullname}</td>
            <td>${employee.position}</td>
            <td>${employee.department}</td>
            <td><span class="status-badge success">${employee.status}</span></td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="viewEmployee('${employee.id}')">Detail</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function loadUsersTable() {
    const tbody = document.getElementById('users-table');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.fullname}</td>
            <td>${user.role === 'admin' ? 'Admin' : 'Pegawai'}</td>
            <td><span class="status-badge success">Aktif</span></td>
            <td>${user.lastLogin ? formatDateTime(user.lastLogin) : 'Belum pernah'}</td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="editUser('${user.id}')">Edit</button>
                ${user.id !== currentUser.id ? `<button class="btn btn-outline btn-sm" onclick="deleteUser('${user.id}')">Hapus</button>` : ''}
            </td>
        `;
        tbody.appendChild(row);
    });
}

function loadMyAttendanceData() {
    const tableBody = document.getElementById('my-attendance-table');
    if (!tableBody) return;
    
    const attendanceData = [
        { date: '2025-11-30', day: 'Kamis', in: '08:00', out: '17:00', status: 'Hadir', note: '' },
        { date: '2025-11-29', day: 'Rabu', in: '08:15', out: '17:30', status: 'Terlambat', note: 'Macet' },
        { date: '2025-11-28', day: 'Selasa', in: '08:00', out: '17:00', status: 'Hadir', note: '' },
        { date: '2025-11-27', day: 'Senin', in: '07:55', out: '17:00', status: 'Hadir', note: '' },
        { date: '2025-11-26', day: 'Minggu', in: '-', out: '-', status: 'Libur', note: 'Hari Libur' },
        { date: '2025-11-25', day: 'Sabtu', in: '-', out: '-', status: 'Cuti', note: 'Cuti Tahunan' }
    ];
    
    tableBody.innerHTML = '';
    
    attendanceData.forEach(data => {
        const row = document.createElement('tr');
        let statusClass = '';
        
        if (data.status === 'Hadir') statusClass = 'success';
        else if (data.status === 'Terlambat') statusClass = 'warning';
        else if (data.status === 'Cuti') statusClass = 'info';
        else statusClass = '';
        
        row.innerHTML = `
            <td>${formatDate(data.date)}</td>
            <td>${data.day}</td>
            <td>${data.in}</td>
            <td>${data.out}</td>
            <td><span class="status-badge ${statusClass}">${data.status}</span></td>
            <td>${data.note}</td>
        `;
        tableBody.appendChild(row);
    });
}

function loadMyLeavesTable() {
    const tbody = document.getElementById('my-leaves-table');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const userLeaves = leaves.filter(leave => leave.userId === currentUser.id);
    
    if (userLeaves.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">Belum ada pengajuan cuti</td>
            </tr>
        `;
        return;
    }
    
    userLeaves.forEach(leave => {
        const row = document.createElement('tr');
        row.setAttribute('data-leave-id', leave.id);
        
        let statusBadge = '';
        if (leave.status === 'approved') {
            statusBadge = '<span class="status-badge success">Disetujui</span>';
        } else if (leave.status === 'rejected') {
            statusBadge = '<span class="status-badge danger">Ditolak</span>';
        } else {
            statusBadge = '<span class="status-badge warning">Menunggu</span>';
        }
        
        row.innerHTML = `
            <td>${leave.type}</td>
            <td>${formatDate(leave.startDate)}</td>
            <td>${formatDate(leave.endDate)}</td>
            <td>${leave.days} hari</td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn btn-outline btn-sm view-leave-detail-btn">
                    <i class="fas fa-eye"></i> Detail
                </button>
                ${leave.status === 'pending' ? `<button class="btn btn-outline btn-sm" onclick="cancelLeave('${leave.id}')">Batalkan</button>` : ''}
            </td>
        `;
        tbody.appendChild(row);
    });
}

function loadNotifications() {
    const container = document.getElementById('notifications-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    const userNotifications = notifications.filter(n => 
        n.userId === 'all' || n.userId === currentUser.id
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    if (userNotifications.length === 0) {
        container.innerHTML = '<p class="text-center">Tidak ada notifikasi</p>';
        return;
    }
    
    userNotifications.forEach(notification => {
        const notificationElement = document.createElement('div');
        notificationElement.className = `d-flex align-center gap-15 p-20 ${notification.read ? '' : 'unread-notification'}`;
        notificationElement.style.borderBottom = '1px solid #eee';
        notificationElement.style.cursor = 'pointer';
        
        let iconColor = 'var(--secondary-color)';
        if (notification.type === 'important') iconColor = 'var(--warning-color)';
        if (notification.type === 'warning') iconColor = 'var(--danger-color)';
        if (notification.type === 'info') iconColor = 'var(--accent-color)';
        
        notificationElement.innerHTML = `
            <div>
                <div style="width: 40px; height: 40px; border-radius: 50%; background-color: ${iconColor}20; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-bell" style="color: ${iconColor};"></i>
                </div>
            </div>
            <div style="flex-grow: 1;">
                <h4 style="margin-bottom: 5px;">${notification.title}</h4>
                <p style="margin-bottom: 5px;">${notification.message}</p>
                <small style="color: #666;">${formatDateTime(notification.createdAt)}</small>
            </div>
            ${!notification.read ? '<div><span class="status-badge info">Baru</span></div>' : ''}
        `;
        
        notificationElement.onclick = function() {
            markNotificationAsRead(notification.id);
        };
        
        container.appendChild(notificationElement);
    });
}

function updateRecentActivities() {
    const tbody = document.getElementById('recent-activities');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const recentLeaves = leaves.slice(-5).reverse();
    
    recentLeaves.forEach(leave => {
        const row = document.createElement('tr');
        let statusBadge = '';
        if (leave.status === 'approved') {
            statusBadge = '<span class="status-badge success">Disetujui</span>';
        } else if (leave.status === 'rejected') {
            statusBadge = '<span class="status-badge danger">Ditolak</span>';
        } else {
            statusBadge = '<span class="status-badge warning">Menunggu</span>';
        }
        
        row.innerHTML = `
            <td>${leave.fullname}</td>
            <td>Pengajuan cuti ${leave.type}</td>
            <td>${formatDateTime(leave.createdAt)}</td>
            <td>${statusBadge}</td>
        `;
        tbody.appendChild(row);
    });
}

// ==================== PAYROLL DETAIL FUNCTIONS ====================
function setupPayrollDetailListeners() {
    // Event listener untuk tombol "Lihat" pada setiap baris slip gaji
    document.addEventListener('click', function(e) {
        if (e.target && e.target.closest('.view-payslip-btn')) {
            e.preventDefault();
            const button = e.target.closest('.view-payslip-btn');
            const row = button.closest('tr');
            
            // Ambil data dari atribut data-*
            const period = row.getAttribute('data-period');
            const date = row.getAttribute('data-date');
            const salary = row.getAttribute('data-salary');
            const allowance = row.getAttribute('data-allowance');
            const deduction = row.getAttribute('data-deduction');
            const thp = row.getAttribute('data-thp');
            const notes = row.getAttribute('data-notes');
            
            // Tampilkan detail
            showPayrollDetail({
                period: period,
                date: date,
                salary: salary,
                allowance: allowance,
                deduction: deduction,
                thp: thp,
                notes: notes || 'Tidak ada catatan khusus'
            });
        }
        
        // Tombol download di baris
        if (e.target && e.target.closest('.download-payslip-btn')) {
            e.preventDefault();
            const button = e.target.closest('.download-payslip-btn');
            const period = button.getAttribute('data-period');
            downloadPayrollSlip(period);
        }
    });
    
    // Tombol close detail
    const closeDetailBtn = document.getElementById('close-payroll-detail');
    if (closeDetailBtn) {
        closeDetailBtn.addEventListener('click', hidePayrollDetail);
    }
    
    // Overlay untuk menutup detail
    const overlay = document.getElementById('payroll-overlay');
    if (overlay) {
        overlay.addEventListener('click', hidePayrollDetail);
    }
    
    const closePayrollFooterBtn = document.getElementById('btn-close-payroll-detail');
    if (closePayrollFooterBtn) {
        closePayrollFooterBtn.addEventListener('click', hidePayrollDetail);
    }
   
    // Close dengan ESC key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            hidePayrollDetail();
        }
    });
}

// Fungsi untuk menampilkan detail slip gaji
function showPayrollDetail(data) {
    // Format rupiah
    const formatRupiah = (angka) => {
        return 'Rp ' + parseInt(angka).toLocaleString('id-ID');
    };
    
    // Hitung total pendapatan
    const totalIncome = parseInt(data.salary) + parseInt(data.allowance);
    
    // Isi data ke container detail
    document.getElementById('detail-payroll-period').textContent = data.period;
    document.getElementById('detail-payroll-date').textContent = data.date;
    document.getElementById('detail-payroll-salary').textContent = formatRupiah(data.salary);
    document.getElementById('detail-payroll-allowance').textContent = formatRupiah(data.allowance);
    document.getElementById('detail-payroll-total-income').textContent = formatRupiah(totalIncome);
    document.getElementById('detail-payroll-deduction').textContent = formatRupiah(data.deduction);
    document.getElementById('detail-payroll-thp').textContent = formatRupiah(data.thp);
    document.getElementById('detail-payroll-notes').textContent = data.notes;
    
    // Tampilkan container detail dan overlay
    document.getElementById('payroll-detail-container').classList.add('active');
    document.getElementById('payroll-overlay').classList.add('active');
    
    // Nonaktifkan scroll pada body
    document.body.style.overflow = 'hidden';
}

// Fungsi untuk menyembunyikan detail slip gaji
function hidePayrollDetail() {
    // Sembunyikan container detail dan overlay
    document.getElementById('payroll-detail-container').classList.remove('active');
    document.getElementById('payroll-overlay').classList.remove('active');
    
    // Aktifkan scroll pada body
    document.body.style.overflow = 'auto';
}

// ==================== CUTI DETAIL FUNCTIONS ====================
function setupLeaveDetailListeners() {
    // Event listener untuk tombol "Detail" pada tabel cuti
    document.addEventListener('click', function(e) {
        if (e.target && e.target.closest('.view-leave-detail-btn')) {
            e.preventDefault();
            const button = e.target.closest('.view-leave-detail-btn');
            const row = button.closest('tr');
            
            // Ambil data dari atribut data-*
            const leaveId = row.getAttribute('data-leave-id');
            
            // Cari data cuti dari array leaves
            const leaveData = leaves.find(l => l.id === leaveId);
            
            if (leaveData) {
                showLeaveDetail(leaveData);
            }
        }
    });
    
    // Tombol close detail cuti
    const closeLeaveDetailBtn = document.getElementById('close-leave-detail');
    if (closeLeaveDetailBtn) {
        closeLeaveDetailBtn.addEventListener('click', hideLeaveDetail);
    }
    
    // Tombol close di dalam detail cuti
    const btnCloseLeaveDetail = document.getElementById('btn-close-leave-detail');
    if (btnCloseLeaveDetail) {
        btnCloseLeaveDetail.addEventListener('click', hideLeaveDetail);
    }
    
    // Overlay untuk menutup detail cuti
    const leaveOverlay = document.getElementById('leave-overlay');
    if (leaveOverlay) {
        leaveOverlay.addEventListener('click', hideLeaveDetail);
    }
    
    // Tombol cetak form cuti
    const btnPrintLeave = document.getElementById('btn-print-leave');
    if (btnPrintLeave) {
        btnPrintLeave.addEventListener('click', function() {
            generateLeaveFormPDF();
        });
    }
    
    
    // Close dengan ESC key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            hideLeaveDetail();
        }
    });
}

// Fungsi untuk menampilkan detail cuti
function showLeaveDetail(leaveData) {
    // Format status
    let statusText = '';
    let statusClass = '';
    switch(leaveData.status) {
        case 'approved':
            statusText = 'Disetujui';
            statusClass = 'success';
            break;
        case 'rejected':
            statusText = 'Ditolak';
            statusClass = 'danger';
            break;
        case 'pending':
            statusText = 'Menunggu Persetujuan';
            statusClass = 'warning';
            break;
        default:
            statusText = leaveData.status;
            statusClass = 'info';
    }
    
    // Isi data ke container detail
    document.getElementById('detail-leave-type').textContent = leaveData.type;
    document.getElementById('detail-leave-employee').textContent = leaveData.fullname;
    document.getElementById('detail-leave-request-date').textContent = formatDate(leaveData.createdAt);
    document.getElementById('detail-leave-start').textContent = formatDate(leaveData.startDate);
    document.getElementById('detail-leave-end').textContent = formatDate(leaveData.endDate);
    document.getElementById('detail-leave-duration').textContent = `${leaveData.days} hari`;
    document.getElementById('detail-leave-supervisor').textContent = leaveData.supervisor || '-';
    document.getElementById('detail-leave-status').innerHTML = `<span class="status-badge ${statusClass}">${statusText}</span>`;
    document.getElementById('detail-leave-approval-date').textContent = leaveData.approvedDate ? formatDate(leaveData.approvedDate) : '-';
    document.getElementById('detail-leave-reason').textContent = leaveData.reason || 'Tidak ada alasan yang dicantumkan';
    document.getElementById('detail-leave-address').textContent = leaveData.address || 'Tidak ada alamat yang dicantumkan';
    
    // Tampilkan container detail dan overlay
    document.getElementById('leave-detail-container').classList.add('active');
    document.getElementById('leave-overlay').classList.add('active');
    
    // Nonaktifkan scroll pada body
    document.body.style.overflow = 'hidden';
}

// Fungsi untuk menyembunyikan detail cuti
function hideLeaveDetail() {
    // Sembunyikan container detail dan overlay
    document.getElementById('leave-detail-container').classList.remove('active');
    document.getElementById('leave-overlay').classList.remove('active');
    
    // Aktifkan scroll pada body
    document.body.style.overflow = 'auto';
}

// Fungsi untuk generate PDF form cuti
function generateLeaveFormPDF() {
    // Periksa jsPDF
    if (typeof window.jspdf === 'undefined') {
        alert('Library PDF tidak dimuat. Silakan refresh halaman.');
        return;
    }

    const { jsPDF } = window.jspdf;
    
    // Ambil data dari modal
    const leaveType = document.getElementById('detail-leave-type').textContent;
    const employeeName = document.getElementById('detail-leave-employee').textContent;
    const leaveStart = document.getElementById('detail-leave-start').textContent;
    const leaveEnd = document.getElementById('detail-leave-end').textContent;
    const leaveDuration = document.getElementById('detail-leave-duration').textContent;
    const leaveReason = document.getElementById('detail-leave-reason').textContent;
    const leaveAddress = document.getElementById('detail-leave-address').textContent;
    const supervisor = document.getElementById('detail-leave-supervisor').textContent;
    
    // Buat PDF
    const doc = new jsPDF();
    
    // Judul
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "bold");
    doc.text("FORMULIR PERMOHONAN CUTI", 105, 20, null, null, "center");
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text("Sistem Informasi Kepegawaian (SIMPEG)", 105, 28, null, null, "center");
    
    // Garis
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    // Data Pegawai
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "bold");
    doc.text("DATA PEGAWAI", 20, 45);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Nama: ${employeeName}`, 20, 55);
    doc.text(`Atasan Langsung: ${supervisor}`, 20, 62);
    doc.text(`Tanggal Cetak: ${formatDate(new Date().toISOString())}`, 110, 55);
    
    // Data Cuti
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DATA CUTI", 20, 75);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Jenis Cuti: ${leaveType}`, 20, 85);
    doc.text(`Tanggal Mulai: ${leaveStart}`, 20, 92);
    doc.text(`Tanggal Selesai: ${leaveEnd}`, 20, 99);
    doc.text(`Lama Cuti: ${leaveDuration}`, 110, 85);
    
    // Alasan Cuti
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("ALASAN CUTI", 20, 115);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const splitReason = doc.splitTextToSize(leaveReason, 150);
    doc.text(splitReason, 20, 125);
    
    // Alamat Selama Cuti
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("ALAMAT SELAMA CUTI", 20, 145);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const splitAddress = doc.splitTextToSize(leaveAddress, 150);
    doc.text(splitAddress, 20, 155);
    
    // Tanda Tangan
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("TANDA TANGAN", 20, 180);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Pemohon,", 40, 190);
    doc.text("(__________________________)", 40, 210);
    
    doc.text("Atasan Langsung,", 140, 190);
    doc.text("(__________________________)", 140, 210);
    
    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Dokumen ini dicetak secara elektronik dari SIMPEG", 105, pageHeight - 10, null, null, "center");
    
    // Simpan file
    const fileName = `Form_Cuti_${employeeName}_${formatDate(new Date().toISOString()).replace(/ /g, '_')}.pdf`;
    doc.save(fileName);
    
    showSuccess(`Form cuti berhasil dicetak sebagai PDF`, 'PDF Berhasil Dibuat');
}




// ==================== PAGE SPECIFIC FUNCTIONS ====================
function loadPageData(pageId) {
    switch(pageId) {
        case 'employee-management':
            loadEmployeesTable();
            break;
        case 'my-leaves':
            loadMyLeavesTable();
            break;
        case 'user-management':
            loadUsersTable();
            break;
        case 'notifications':
            loadNotifications();
            break;
        case 'attendance':
            loadAttendanceData();
            loadLeaveRequestsTable();
            break;
        case 'payroll':
            loadPayrollData();
            break;
        case 'performance':
            loadPerformanceData();
            break;
        case 'my-payroll':
            loadMyPayrollData();
            setupPayrollDetailListeners();
            break;
        case 'my-performance':
            loadMyPerformanceData();
            break;
        case 'my-attendance':
            loadMyAttendanceData();
            updateAttendanceStats();
            break;
        case 'my-training':
            loadMyTrainingData();
            break;
        case 'profile':
            // Profile page doesn't need additional data loading
            break;
    }
}

function loadAttendanceData() {
    document.getElementById('attendance-present').textContent = employees.filter(emp => emp.status === 'Aktif').length;
    document.getElementById('attendance-late').textContent = Math.floor(employees.length * 0.08);
    document.getElementById('attendance-leave').textContent = leaves.filter(l => l.status === 'pending').length;
    document.getElementById('attendance-overtime').textContent = Math.floor(employees.length * 4.5);
}

function loadLeaveRequestsTable() {
    const tbody = document.getElementById('leave-requests-table');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const pendingLeaves = leaves.filter(leave => leave.status === 'pending');
    
    if (pendingLeaves.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">Tidak ada pengajuan cuti yang menunggu</td>
            </tr>
        `;
        return;
    }
    
    pendingLeaves.forEach(leave => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${leave.fullname}</td>
            <td>${leave.type}</td>
            <td>${formatDate(leave.startDate)}</td>
            <td>${formatDate(leave.endDate)}</td>
            <td>${leave.days} hari</td>
            <td><span class="status-badge warning">Menunggu</span></td>
            <td>
                <button class="btn btn-success btn-sm" onclick="approveLeave('${leave.id}')">
                    <i class="fas fa-check"></i> Setujui
                </button>
                <button class="btn btn-danger btn-sm" onclick="rejectLeave('${leave.id}')">
                    <i class="fas fa-times"></i> Tolak
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function loadPayrollData() {
    const basicSalary = employees.length * 12500000;
    const allowance = employees.length * 2875000;
    const deduction = employees.length * 525000;
    const total = basicSalary + allowance - deduction;
    
    document.getElementById('total-basic-salary').textContent = `Rp ${(basicSalary / 1000000).toFixed(1)}M`;
    document.getElementById('total-allowance').textContent = `Rp ${(allowance / 1000000).toFixed(1)}M`;
    document.getElementById('total-deduction').textContent = `Rp ${(deduction / 1000000).toFixed(1)}M`;
    document.getElementById('total-payroll-summary').textContent = `Rp ${(total / 1000000).toFixed(1)}M`;
}

function loadPerformanceData() {
    const performanceData = [
        { name: "Budi Santoso", skp: 92.5, behavior: 88.0, total: 90.25 },
        { name: "Siti Nurhaliza", skp: 88.0, behavior: 91.5, total: 89.75 },
        { name: "Ahmad Fauzi", skp: 85.5, behavior: 86.0, total: 85.75 }
    ];
    
    const tableBody = document.getElementById('performance-results-table');
    if (tableBody) {
        tableBody.innerHTML = '';
        performanceData.forEach(data => {
            const row = document.createElement('tr');
            const category = data.total >= 90 ? 'Sangat Baik' : data.total >= 80 ? 'Baik' : 'Cukup';
            const badgeClass = data.total >= 90 ? 'success' : data.total >= 80 ? 'info' : 'warning';
            
            row.innerHTML = `
                <td>${data.name}</td>
                <td>${getPositionByName(data.name)}</td>
                <td>${data.skp.toFixed(1)}</td>
                <td>${data.behavior.toFixed(1)}</td>
                <td>${data.total.toFixed(2)}</td>
                <td><span class="status-badge ${badgeClass}">${category}</span></td>
            `;
            tableBody.appendChild(row);
        });
    }
}

function getPositionByName(name) {
    const user = users.find(u => u.fullname === name);
    return user ? user.position : 'Staff';
}

function loadMyPayrollData() {
    const payrollData = [
        { 
            period: "November 2025", 
            date: "2025-12-05", 
            basic: 15000000, 
            allowance: 3500000, 
            deduction: 1200000, 
            total: 17300000,
            notes: "Potongan termasuk pajak penghasilan dan BPJS"
        },
        { 
            period: "Oktober 2025", 
            date: "2025-11-05", 
            basic: 15000000, 
            allowance: 3500000, 
            deduction: 1150000, 
            total: 17350000,
            notes: "Potongan termasuk pajak penghasilan, BPJS, dan iuran pensiun"
        },
        { 
            period: "September 2025", 
            date: "2025-10-05", 
            basic: 15000000, 
            allowance: 3200000, 
            deduction: 1100000, 
            total: 17100000,
            notes: "Potongan termasuk pajak penghasilan dan BPJS. Tunjangan transportasi dikurangi karena cuti 3 hari."
        }
    ];
    
    const tableBody = document.getElementById('my-payroll-table');
    if (tableBody) {
        tableBody.innerHTML = '';
        payrollData.forEach(data => {
            const row = document.createElement('tr');
            row.setAttribute('data-period', data.period);
            row.setAttribute('data-date', data.date);
            row.setAttribute('data-salary', data.basic);
            row.setAttribute('data-allowance', data.allowance);
            row.setAttribute('data-deduction', data.deduction);
            row.setAttribute('data-thp', data.total);
            row.setAttribute('data-notes', data.notes);
            
            row.innerHTML = `
                <td>${data.period}</td>
                <td>${data.date}</td>
                <td>Rp ${data.basic.toLocaleString('id-ID')}</td>
                <td>Rp ${data.allowance.toLocaleString('id-ID')}</td>
                <td>Rp ${data.deduction.toLocaleString('id-ID')}</td>
                <td><strong>Rp ${data.total.toLocaleString('id-ID')}</strong></td>
                <td>
                    <button class="btn btn-outline btn-sm view-payslip-btn">
                        <i class="fas fa-eye"></i> Lihat
                    </button>
    
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

function loadMyTrainingData() {
    const trainingData = [
        { name: "Leadership Development Program", type: "Soft Skill", date: "2025-12-05 s/d 2025-12-07", status: "Terdaftar", certificate: "-" },
        { name: "Cybersecurity Fundamentals", type: "Technical", date: "2025-11-15 s/d 2025-11-17", status: "Selesai", certificate: "Tersedia" },
        { name: "Effective Communication", type: "Soft Skill", date: "2025-10-05 s/d 2025-10-06", status: "Selesai", certificate: "Tersedia" }
    ];
    
    const tableBody = document.getElementById('my-trainings-table');
    if (tableBody) {
        tableBody.innerHTML = '';
        trainingData.forEach(data => {
            const row = document.createElement('tr');
            const statusClass = data.status === 'Selesai' ? 'success' : 'info';
            const certButton = data.certificate === 'Tersedia' ? 
                '<button class="btn btn-outline btn-sm"><i class="fas fa-download"></i></button>' : '-';
            
            row.innerHTML = `
                <td>${data.name}</td>
                <td>${data.type}</td>
                <td>${data.date}</td>
                <td><span class="status-badge ${statusClass}">${data.status}</span></td>
                <td>${certButton}</td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// ==================== ACTION FUNCTIONS ====================
function viewEmployee(employeeId) {
    const employee = employees.find(e => e.id === employeeId);
    if (employee) {
        alert(`Detail Pegawai:\n\nNama: ${employee.fullname}\nNIP: ${employee.nip}\nJabatan: ${employee.position}\nDivisi: ${employee.department}\nStatus: ${employee.status}`);
    }
}

function viewLeave(leaveId) {
    const leave = leaves.find(l => l.id === leaveId);
    if (leave) {
        let statusText = '';
        if (leave.status === 'approved') statusText = 'Disetujui';
        else if (leave.status === 'rejected') statusText = 'Ditolak';
        else statusText = 'Menunggu';
        
        alert(`Detail Cuti:\n\nJenis: ${leave.type}\nTanggal: ${formatDate(leave.startDate)} - ${formatDate(leave.endDate)}\nLama: ${leave.days} hari\nStatus: ${statusText}\nAlasan: ${leave.reason}`);
    }
}

function cancelLeave(leaveId) {
    showConfirmation(
        'Apakah Anda yakin ingin membatalkan pengajuan cuti ini?',
        'Batalkan Cuti',
        function() {
            const leaveIndex = leaves.findIndex(l => l.id === leaveId);
            if (leaveIndex !== -1) {
                leaves.splice(leaveIndex, 1);
                saveLeaves();
                loadMyLeavesTable();
                showSuccess('Pengajuan cuti berhasil dibatalkan');
            }
        }
    );
}

function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        alert(`Edit pengguna ${user.fullname} (Fitur lengkap dalam pengembangan)`);
    }
}

function deleteUser(userId) {
    if (userId === currentUser.id) {
        alert('Anda tidak dapat menghapus akun sendiri');
        return;
    }
    
    showConfirmation(
        'Apakah Anda yakin ingin menghapus pengguna ini?',
        'Hapus Pengguna',
        function() {
            const userIndex = users.findIndex(u => u.id === userId);
            if (userIndex !== -1) {
                users.splice(userIndex, 1);
                saveUsers();
                loadUsersTable();
                showSuccess('Pengguna berhasil dihapus');
            }
        }
    );
}

function markNotificationAsRead(notificationId) {
    const notificationIndex = notifications.findIndex(n => n.id === notificationId);
    if (notificationIndex !== -1) {
        notifications[notificationIndex].read = true;
        saveNotifications();
        updateNotificationBadges();
        loadNotifications();
    }
}

function approveLeave(leaveId) {
    const leaveIndex = leaves.findIndex(l => l.id === leaveId);
    if (leaveIndex !== -1) {
        leaves[leaveIndex].status = 'approved';
        saveLeaves();
        
        showSuccess('Cuti berhasil disetujui');
        loadLeaveRequestsTable();
    }
}

function rejectLeave(leaveId) {
    const leaveIndex = leaves.findIndex(l => l.id === leaveId);
    if (leaveIndex !== -1) {
        leaves[leaveIndex].status = 'rejected';
        saveLeaves();
        
        showSuccess('Cuti berhasil ditolak');
        loadLeaveRequestsTable();
    }
}

// ==================== MODAL FUNCTIONS ====================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            
            if (login(username, password)) {
                showAppPages();
            } else {
                showError('login-error', 'Username atau password salah');
            }
        });
    // Notification icon click
     const notificationIcon = document.getElementById('notification-icon');
    if (notificationIcon) {
        notificationIcon.addEventListener('click', function(e) {
            e.preventDefault();
            navigateToPage('notifications');
        });
    }
    }

    const forgotPasswordLink = document.getElementById('forgot-password');
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        showForgotPasswordPage();
    });
}

const forgotPasswordForm = document.getElementById('forgot-password-form');
if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('forgot-email').value;
        
        // Cek apakah email terdaftar
        const userExists = users.find(u => u.email === email);
        
        if (userExists) {
            showResetPasswordPage(email);
            document.getElementById('forgot-password-success').textContent = 
                'Instruksi reset password telah dikirim ke email ' + email + 
                '. Silakan buat password baru.';
            document.getElementById('forgot-password-success').style.display = 'block';
            
            // Reset form
            this.reset();
        } else {
            showError('forgot-password-error', 'Email tidak terdaftar di sistem');
        }
    });
}

// Event listener untuk form reset password
const resetPasswordForm = document.getElementById('reset-password-form');
if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('reset-email').value;
        const token = document.getElementById('reset-token').value;
        const newPassword = document.getElementById('new-reset-password').value;
        const confirmPassword = document.getElementById('confirm-reset-password').value;
        
        // Validasi input
        if (newPassword.length < 8) {
            showError('reset-password-error', 'Password minimal 8 karakter');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showError('reset-password-error', 'Password tidak cocok');
            return;
        }
        
        // Reset password
        const result = resetPassword(email, token, newPassword);
        
        if (result.success) {
            document.getElementById('reset-password-success').textContent = result.message;
            document.getElementById('reset-password-success').style.display = 'block';
            
            // Reset form
            this.reset();
            
            // Otomatis kembali ke login setelah 3 detik
            setTimeout(() => {
                showLoginPage();
            }, 3000);
        } else {
            showError('reset-password-error', result.message);
        }
    });
}

// Event listener untuk kembali ke login dari halaman lupa password
const showLoginFromForgot = document.getElementById('show-login-from-forgot');
if (showLoginFromForgot) {
    showLoginFromForgot.addEventListener('click', function(e) {
        e.preventDefault();
        showLoginPage();
    });
}

// Event listener untuk kembali ke login dari halaman reset password
const showLoginFromReset = document.getElementById('show-login-from-reset');
if (showLoginFromReset) {
    showLoginFromReset.addEventListener('click', function(e) {
        e.preventDefault();
        showLoginPage();
    });
}

// Fungsi untuk menampilkan halaman login
function showLoginPage() {
    document.getElementById('auth-container').classList.remove('hidden');
    document.getElementById('register-page').classList.add('hidden');
    document.getElementById('forgot-password-page').classList.add('hidden');
    document.getElementById('reset-password-page').classList.add('hidden');
}

// Event listener untuk tombol toggle password di form reset password
const resetPasswordToggle = document.getElementById('reset-password-toggle');
if (resetPasswordToggle) {
    resetPasswordToggle.addEventListener('click', function() {
        const input = this.parentElement.querySelector('input');
        const icon = this.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    });
}
    
    // Register Form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const role = document.getElementById('register-role').value;
            const fullname = document.getElementById('register-fullname').value;
            const username = document.getElementById('register-username').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            const nip = document.getElementById('register-nip').value;
            const position = document.getElementById('register-position').value;
            const monthDropdown = document.getElementById('attendance-month');
                if (monthDropdown) {
                monthDropdown.addEventListener('change', updateAttendanceStats);
             }
            
            if (password.length < 8) {
                showError('register-error', 'Password minimal 8 karakter');
                return;
            }
            
            if (password !== confirmPassword) {
                showError('register-error', 'Password tidak cocok');
                return;
            }
            
            const result = register({
                fullname,
                username,
                email,
                password,
                role,
                nip,
                position,
                phone: ''
            });
            
            if (result.success) {
                document.getElementById('register-success').textContent = result.message;
                document.getElementById('register-success').style.display = 'block';
                registerForm.reset();
                
                setTimeout(() => {
                    document.getElementById('register-success').style.display = 'none';
                    // Kembali ke login page setelah register berhasil
                    document.getElementById('register-page').classList.add('hidden');
                    document.getElementById('auth-container').classList.remove('hidden');
                }, 3000);
            } else {
                showError('register-error', result.message);
            }
        });
    }
    
    
    // Role Selection
    document.querySelectorAll('.role-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.role-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
            document.getElementById('register-role').value = this.dataset.role;
        });
    });
    
    // Password Toggle
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    });
    
    // Page Navigation
    document.querySelectorAll('.menu-item[data-page]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            navigateToPage(pageId);
        });
    });

    // View All Activities button
    const viewAllActivitiesBtn = document.getElementById('view-all-activities');
    if (viewAllActivitiesBtn) {
        viewAllActivitiesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentUser.role === 'admin') {
                navigateToPage('attendance');
            } else {
                navigateToPage('my-leaves');
            }
        });
    }
    
    // View All Results button (Performance)
    const viewAllResultsBtn = document.getElementById('view-all-results');
    if (viewAllResultsBtn) {
        viewAllResultsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentUser.role === 'admin') {
                navigateToPage('performance');
            } else {
                navigateToPage('my-performance');
            }
        });
    }
    
    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // ==================== SWITCH AUTH PAGES ==================== ARIF JS
    // Handle "Daftar di sini" dari login page
    const showRegister = document.getElementById('show-register');
    if (showRegister) {
        showRegister.addEventListener('click', function(e) {
            e.preventDefault();
            
            // SEMBUNYIKAN SEMUA bagian login (auth-container)
            document.getElementById('auth-container').classList.add('hidden');
            
            // TAMPILKAN SEMUA bagian register (register-page)
            document.getElementById('register-page').classList.remove('hidden');
        });
    }
    
    // Handle "Masuk di sini" dari register page  
    const showLogin = document.getElementById('show-login');
    if (showLogin) {
        showLogin.addEventListener('click', function(e) {
            e.preventDefault();
            
            // SEMBUNYIKAN SEMUA bagian register (register-page)
            document.getElementById('register-page').classList.add('hidden');
            
            // TAMPILKAN SEMUA bagian login (auth-container)
            document.getElementById('auth-container').classList.remove('hidden');
        });
    }
    
    // Modal Handling
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
    
    // Quick Actions
    const requestLeaveBtn = document.getElementById('btn-request-leave');
    if (requestLeaveBtn) requestLeaveBtn.addEventListener('click', () => openModal('modal-request-leave'));
    
    const addEmployeeBtn = document.getElementById('btn-add-employee-admin');
    if (addEmployeeBtn) addEmployeeBtn.addEventListener('click', () => openModal('modal-add-employee'));
    
    const addUserBtn = document.getElementById('btn-add-user');
    if (addUserBtn) addUserBtn.addEventListener('click', () => openModal('modal-add-user'));
    
    const btnAddEmployee = document.getElementById('btn-add-employee');
    if (btnAddEmployee) btnAddEmployee.addEventListener('click', () => openModal('modal-add-employee'));
    
    const btnRequestNewLeave = document.getElementById('btn-request-new-leave');
    if (btnRequestNewLeave) btnRequestNewLeave.addEventListener('click', () => openModal('modal-request-leave'));
    
    // Form Submissions
    const addEmployeeForm = document.getElementById('form-add-employee');
    if (addEmployeeForm) {
        addEmployeeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newEmployee = {
                id: generateEmployeeId(),
                userId: '',
                fullname: document.getElementById('new-employee-name').value,
                nip: document.getElementById('new-employee-nip').value,
                position: document.getElementById('new-employee-position').value,
                department: document.getElementById('new-employee-department').value,
                email: document.getElementById('new-employee-email').value,
                phone: document.getElementById('new-employee-phone').value,
                address: document.getElementById('new-employee-address').value,
                status: 'Aktif',
                joinDate: new Date().toISOString().split('T')[0]
            };
            
            employees.push(newEmployee);
            saveEmployees();
            loadEmployeesTable();
            
            closeModal('modal-add-employee');
            showSuccess('Data pegawai berhasil ditambahkan');
            this.reset();
        });
    }
    
    const requestLeaveForm = document.getElementById('form-request-leave');
    if (requestLeaveForm) {
        requestLeaveForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newLeave = {
                id: 'leave_' + Date.now(),
                userId: currentUser.id,
                fullname: currentUser.fullname,
                type: document.getElementById('leave-type').value,
                startDate: document.getElementById('leave-start-date').value,
                endDate: document.getElementById('leave-end-date').value,
                days: parseInt(document.getElementById('leave-days').value),
                reason: document.getElementById('leave-reason').value,
                address: document.getElementById('leave-address').value,
                supervisor: document.getElementById('leave-supervisor').value,
                status: 'pending',
                createdAt: new Date().toISOString()
            };
            
            leaves.push(newLeave);
            saveLeaves();
            loadMyLeavesTable();
            
            closeModal('modal-request-leave');
            showSuccess('Pengajuan cuti berhasil dikirim');
            this.reset();
        });
    }
    
    const addUserForm = document.getElementById('form-add-user');
    if (addUserForm) {
        addUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userData = {
                fullname: document.getElementById('new-user-fullname').value,
                username: document.getElementById('new-user-username').value,
                email: document.getElementById('new-user-email').value,
                password: document.getElementById('new-user-password').value,
                role: document.getElementById('new-user-role').value,
                nip: document.getElementById('new-user-nip').value,
                position: document.getElementById('new-user-position').value,
                phone: ''
            };
            
            const result = register(userData);
            
            if (result.success) {
                loadUsersTable();
                closeModal('modal-add-user');
                showSuccess('Pengguna berhasil ditambahkan');
                this.reset();
            } else {
                alert(result.message);
            }
        });
    }
    
    // Profile Form - Informasi Pribadi
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                users[userIndex].fullname = document.getElementById('profile-fullname').value;
                users[userIndex].email = document.getElementById('profile-email').value;
                users[userIndex].phone = document.getElementById('profile-phone').value;
                
                saveUsers();
                
                currentUser = { ...users[userIndex] };
                delete currentUser.password;
                sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                updateUserUI();
                showSuccess('Profil berhasil diperbarui');
            }
        });
    }
    
    // Form Ubah Password - PERBAIKAN DI SINI
    const changePasswordForm = document.getElementById('change-password-form');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmNewPassword = document.getElementById('confirm-new-password').value;
            
            // Validasi input
            if (!currentPassword || !newPassword || !confirmNewPassword) {
                alert('Harap lengkapi semua field');
                return;
            }
            
            if (newPassword.length < 8) {
                alert('Password baru minimal 8 karakter');
                return;
            }
            
            if (newPassword !== confirmNewPassword) {
                alert('Konfirmasi password baru tidak cocok');
                return;
            }
            
            // Cari user yang sedang login
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex === -1) {
                alert('User tidak ditemukan');
                return;
            }
            
            // Verifikasi password saat ini
            if (users[userIndex].password !== currentPassword) {
                alert('Password saat ini salah');
                return;
            }
            
            // Update password
            users[userIndex].password = newPassword;
            
            // Simpan ke localStorage
            saveUsers();
            
            // Update currentUser di sessionStorage
            currentUser.password = newPassword;
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Tampilkan pesan sukses
            showSuccess('Password berhasil diubah!');
            
            // Reset form
            this.reset();
        });
    }
    
    // Mark all notifications as read
    const markAllReadBtn = document.getElementById('mark-all-read');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            notifications.forEach(notification => {
                if (notification.userId === 'all' || notification.userId === currentUser.id) {
                    notification.read = true;
                }
            });
            
            saveNotifications();
            updateNotificationBadges();
            loadNotifications();
            
            showSuccess('Semua notifikasi ditandai sebagai terbaca');
        });
    }
    
    // Forgot password
    const forgotPasswordBtn = document.getElementById('forgot-password');
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', function(e) {
            e.preventDefault();

        });
    }
    

    // Employee buttons
    const viewPayslipBtn = document.getElementById('btn-view-payslip');
    if (viewPayslipBtn) {
        viewPayslipBtn.addEventListener('click', function(e) {
            e.preventDefault();
            navigateToPage('my-payroll');
        });
    }
    
    const updateProfileBtn = document.getElementById('btn-update-profile');
    if (updateProfileBtn) {
        updateProfileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            navigateToPage('profile');
        });
    }
    
   
    
    // View Performance Detail button
    const viewPerformanceDetailBtn = document.getElementById('view-performance-detail');
    if (viewPerformanceDetailBtn) {
        viewPerformanceDetailBtn.addEventListener('click', function(e) {
            e.preventDefault();
            navigateToPage('my-performance');
        });
    }

    // Button "Ajukan Cuti" untuk konsistensi
    const requestLeaveQuickBtn = document.getElementById('btn-request-leave');
    if (requestLeaveQuickBtn) {
        requestLeaveQuickBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal('modal-request-leave');
        });
    }
    
    // Search functionality
    const searchEmployee = document.getElementById('search-employee');
    if (searchEmployee) {
        searchEmployee.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('#employees-table tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
    
    const globalSearch = document.getElementById('global-search');
    if (globalSearch) {
        globalSearch.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                showSuccess(`Mencari: "${this.value}"`, 'Pencarian');
            }
        });
    }
    
    // Tabs functionality
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('tab')) {
            e.preventDefault();
            const tab = e.target;
            const tabContainer = tab.closest('.tabs');
            const tabId = tab.getAttribute('data-tab');
            
            tabContainer.querySelectorAll('.tab').forEach(t => {
                t.classList.remove('active');
            });
            
            tab.classList.add('active');
            
            const tabContentContainer = tab.closest('.dashboard-card');
            if (tabContentContainer) {
                tabContentContainer.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                    content.classList.add('hidden');
                });
                
                const tabContent = document.getElementById(`${tabId}-tab`);
                if (tabContent) {
                    tabContent.classList.remove('hidden');
                    tabContent.classList.add('active');
                }
            }
        }
    });
    
    // Tabs khusus untuk halaman profil
    document.querySelectorAll('#profile-content .tab').forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            
            // Update tab aktif
            document.querySelectorAll('#profile-content .tab').forEach(t => {
                t.classList.remove('active');
            });
            this.classList.add('active');
            
            // Update konten tab
            document.querySelectorAll('#profile-content .tab-content').forEach(content => {
                content.classList.remove('active');
                content.classList.add('hidden');
            });
            
            const tabContent = document.getElementById(`${tabId}-tab`);
            if (tabContent) {
                tabContent.classList.remove('hidden');
                tabContent.classList.add('active');
            }
        });
    });
}

// ==================== HELPER FUNCTIONS ====================
function updatePageTitle(pageId) {
    const titles = {
        'dashboard': 'Dashboard SIMPEG',
        'profile': 'Profil Saya',
        'employee-management': 'Manajemen Data Pegawai',
        'my-leaves': 'Cuti Saya',
        'user-management': 'Manajemen Pengguna',
        'notifications': 'Notifikasi & Pengingat',
        'attendance': 'Absensi & Cuti',
        'payroll': 'Penggajian',
        'performance': 'Penilaian Kinerja',
        'my-payroll': 'Slip Gaji Saya',
        'my-performance': 'Kinerja Saya',
        'my-training': 'Pelatihan Saya',
        'my-attendance': 'Absensi Saya'
    };
    
    const descriptions = {
        'dashboard': 'Selamat datang di Sistem Informasi Kepegawaian. Pantau data kepegawaian secara real-time.',
        'profile': 'Kelola informasi profil pribadi Anda.',
        'employee-management': 'Kelola biodata, riwayat jabatan, pendidikan, keluarga, dan data lainnya.',
        'my-leaves': 'Kelola pengajuan cuti dan lihat riwayat cuti Anda.',
        'user-management': 'Kelola akun pengguna, hak akses, dan reset password.',
        'notifications': 'Notifikasi otomatis untuk kenaikan gaji, pangkat, pensiun, dan pengingat acara penting.',
        'attendance': 'Kelola data kehadiran, lembur, dan pengajuan cuti seluruh pegawai.',
        'payroll': 'Kelola perhitungan gaji, tunjangan, potongan, dan pembayaran gaji pegawai.',
        'performance': 'Kelola penilaian kinerja pegawai berbasis SKP (Sasaran Kerja Pegawai).',
        'my-payroll': 'Lihat dan unduh slip gaji Anda.',
        'my-performance': 'Pantau dan kelola penilaian kinerja Anda.',
        'my-training': 'Daftar dan kelola pelatihan yang Anda ikuti.',
        'my-attendance': 'Pantau kehadiran dan catatan absensi Anda.'
    };
    
    const pageTitle = document.querySelector('.page-title h2');
    const pageDescription = document.querySelector('.page-title p');
    
    if (pageTitle && pageDescription) {
        pageTitle.textContent = titles[pageId] || 'Dashboard SIMPEG';
        pageDescription.textContent = descriptions[pageId] || 'Selamat datang di Sistem Informasi Kepegawaian';
    }
}

function navigateToPage(pageId) {
    // Update menu item active state
    document.querySelectorAll('.menu-item').forEach(i => {
        i.classList.remove('active');
    });
    
    // Add active class to the target menu item
    const targetMenuItem = document.querySelector(`.menu-item[data-page="${pageId}"]`);
    if (targetMenuItem) {
        targetMenuItem.classList.add('active');
    }
    
    // Hide all page content
    document.querySelectorAll('.page-content').forEach(content => {
        content.classList.remove('active');
        content.classList.add('hidden');
    });
    
    // Show target page content
    const pageContent = document.getElementById(`${pageId}-content`);
    if (pageContent) {
        pageContent.classList.remove('hidden');
        pageContent.classList.add('active');
        
        updatePageTitle(pageId);
        loadPageData(pageId);
    }
    
    // Close sidebar on mobile (responsive behavior)
    if (window.innerWidth <= 992) {
        const sidebar = document.querySelector('.sidebar');
        const app = document.getElementById('app-container');
        const btn = document.getElementById('toggleSidebar');
        
        sidebar.classList.add('hidden');
        app.classList.add('sidebar-hidden');
        btn.classList.add('sidebar-closed');
    }
}

// ==================== INITIALIZATION ====================
function initializeApp() {
    initializeUsers();
    initializeLeaves();
    initializeNotifications();
    setupEventListeners();
    setupPayrollDetailListeners();
    setupLeaveDetailListeners();
    
    if (!checkAuth()) {
        showAuthPages();
    } else {
        showAppPages();
    }
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const leaveStartDate = document.getElementById('leave-start-date');
    const leaveEndDate = document.getElementById('leave-end-date');
    
    if (leaveStartDate && leaveEndDate) {
        leaveStartDate.valueAsDate = tomorrow;
        leaveEndDate.valueAsDate = tomorrow;
    }
    
    const roleOption = document.querySelector('.role-option[data-role="pegawai"]');
    if (roleOption) {
        roleOption.classList.add('selected');
    }
    
    console.log('SIMPEG Application initialized');
    console.log('Default Admin: username=admin, password=admin123');
}

// Di akhir fungsi initializeApp(), tambahkan:
function cleanupExpiredResetTokens() {
    const now = Date.now();
    
    // Hapus token yang sudah kadaluarsa
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('reset_token_expiry_')) {
            const expiry = localStorage.getItem(key);
            if (now > expiry) {
                const email = key.replace('reset_token_expiry_', '');
                localStorage.removeItem(key);
                localStorage.removeItem('reset_token_' + email);
            }
        }
    }
}

// Panggil fungsi cleanup saat inisialisasi
cleanupExpiredResetTokens();
// ==================== MANUAL ATTENDANCE (NO DATABASE) ====================
function loadManualAttendance() {
    const table = document.getElementById('my-attendance-table');
    if (!table || !currentUser) return;

    const key = `attendance_${currentUser.id}`;
    const data = JSON.parse(localStorage.getItem(key)) || [];

    table.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(item.date)}</td>
            <td>${item.day}</td>
            <td>${item.in || '-'}</td>
            <td>${item.out || '-'}</td>
            <td><span class="status-badge info">${item.status}</span></td>
            <td>${item.note || '-'}</td>
        `;
        table.appendChild(row);
    });
}
// ==================== PDF SLIP GAJI ==================== ISAN BUAT PDF SLIP GAJI 
function generatePayrollPDF() {
    // Periksa jsPDF
    if (typeof window.jspdf === 'undefined') {
        alert('Library PDF tidak dimuat. Silakan refresh halaman.');
        return;
    }

    const { jsPDF } = window.jspdf;
    
    // Ambil data dari modal
    const period = document.getElementById('detail-payroll-period').textContent;
    const date = document.getElementById('detail-payroll-date').textContent;
    const salary = document.getElementById('detail-payroll-salary').textContent;
    const allowance = document.getElementById('detail-payroll-allowance').textContent;
    const totalIncome = document.getElementById('detail-payroll-total-income').textContent;
    const deduction = document.getElementById('detail-payroll-deduction').textContent;
    const thp = document.getElementById('detail-payroll-thp').textContent;
    
    // Data karyawan
    const employeeName = currentUser.fullname;
    const employeeNIP = currentUser.nip || '-';
    const employeePosition = currentUser.position || '-';
    
    // Buat PDF
    const doc = new jsPDF();
    
    // Judul
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "bold");
    doc.text("SLIP GAJI PEGAWAI", 105, 20, null, null, "center");
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text("Sistem Informasi Kepegawaian (SIMPEG)", 105, 28, null, null, "center");
    
    // Garis
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    // Info Karyawan
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "bold");
    doc.text("Informasi Karyawan", 20, 45);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Nama: ${employeeName}`, 20, 55);
    doc.text(`NIP: ${employeeNIP}`, 20, 62);
    doc.text(`Jabatan: ${employeePosition}`, 20, 69);
    doc.text(`Periode: ${period}`, 110, 55);
    doc.text(`Tanggal: ${date}`, 110, 62);
    
    // Pendapatan
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Pendapatan", 20, 85);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Gaji Pokok", 25, 95);
    doc.text(salary, 160, 95, null, null, "right");
    
    doc.text("Tunjangan", 25, 102);
    doc.text(allowance, 160, 102, null, null, "right");
    
    doc.setFont("helvetica", "bold");
    doc.text("Total Pendapatan", 25, 109);
    doc.text(totalIncome, 160, 109, null, null, "right");
    
    // Potongan
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Potongan", 20, 125);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Jumlah Potongan", 25, 135);
    doc.text(deduction, 160, 135, null, null, "right");
    
    // Take Home Pay
    doc.setFillColor(230, 245, 230);
    doc.rect(20, 145, 170, 15, 'F');
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 100, 0);
    doc.text("TAKE HOME PAY", 25, 155);
    doc.text(thp, 160, 155, null, null, "right");
    
    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Dicetak pada: ${formatDateTime(new Date().toISOString())}`, 105, pageHeight - 10, null, null, "center");
    
    // Simpan file
    const fileName = `Slip_Gaji_${period.replace(/ /g, '_')}_${employeeName}.pdf`;
    doc.save(fileName);
    
    showSuccess(`Slip gaji berhasil diunduh sebagai PDF`, 'PDF Berhasil Dibuat');
}

// Ganti fungsi printSlip lama dengan yang baru
function printSlip() {
    generatePayrollPDF();
}
document.addEventListener('submit', function (e) {
    if (e.target.id !== 'manual-attendance-form') return;

    e.preventDefault();
    if (!currentUser) return;

    const key = `attendance_${currentUser.id}`;
    const data = JSON.parse(localStorage.getItem(key)) || [];

    data.push({
        date: document.getElementById('att-date').value,
        day: document.getElementById('att-day').value,
        in: document.getElementById('att-in').value,
        out: document.getElementById('att-out').value,
        status: document.getElementById('att-status').value,
        note: document.getElementById('att-note').value
    });

    localStorage.setItem(key, JSON.stringify(data));
    e.target.reset();
    loadManualAttendance();
    updateAttendanceStats();
});

// LOAD SAAT BUKA HALAMAN ABSENSI
const originalLoadPageData = loadPageData;
loadPageData = function(pageId) {
    originalLoadPageData(pageId);
    if (pageId === 'my-attendance') {
        loadManualAttendance();
    }
};

// ==================== UPDATE ATTENDANCE STATISTICS ====================
function updateAttendanceStats() {
    if (!currentUser) return;

    const key = `attendance_${currentUser.id}`;
    const data = JSON.parse(localStorage.getItem(key)) || [];

    // Filter data untuk bulan yang dipilih (default: bulan saat ini)
    const selectedMonth = document.getElementById('attendance-month') 
        ? document.getElementById('attendance-month').value 
        : 'november';

    // Mapping nama bulan ke angka
    const monthMap = {
        'januari': 1, 'februari': 2, 'maret': 3, 'april': 4, 'mei': 5, 'juni': 6,
        'juli': 7, 'agustus': 8, 'september': 9, 'oktober': 10, 'november': 11, 'desember': 12
    };

    const monthNumber = monthMap[selectedMonth.toLowerCase()];
    let filteredData = data;

    if (monthNumber) {
        filteredData = data.filter(item => {
            const date = new Date(item.date);
            return date.getMonth() + 1 === monthNumber && date.getFullYear() === 2025;
        });
    }

    // Hitung statistik
    let present = 0;
    let late = 0;
    let leave = 0;
    let overtime = 0;

    filteredData.forEach(item => {
        switch (item.status) {
            case 'Hadir':
                present++;
                break;
            case 'Terlambat':
                late++;
                break;
            case 'Cuti':
                leave++;
                break;
            case 'Jam Lembur':
                overtime++;
                break;
        }
    });

    // Update tampilan statistik
    const presentEl = document.getElementById('my-attendance-present');
    const lateEl = document.getElementById('my-attendance-late');
    const leaveEl = document.getElementById('my-attendance-leave');
    const overtimeEl = document.getElementById('my-attendance-overtime');

    if (presentEl) presentEl.textContent = present;
    if (lateEl) lateEl.textContent = late;
    if (leaveEl) leaveEl.textContent = leave;
    if (overtimeEl) overtimeEl.textContent = overtime;
}

// ==================== FORGOT PASSWORD FUNCTIONS ====================
function showForgotPasswordPage() {
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('register-page').classList.add('hidden');
    document.getElementById('forgot-password-page').classList.remove('hidden');
    document.getElementById('reset-password-page').classList.add('hidden');
}

function showResetPasswordPage(email) {
    document.getElementById('forgot-password-page').classList.add('hidden');
    document.getElementById('reset-password-page').classList.remove('hidden');
    
    // Set email di form reset
    document.getElementById('reset-email').value = email;
    
    // Generate token simulasi
    const token = 'reset_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    document.getElementById('reset-token').value = token;
    
    // Simpan token di localStorage untuk validasi
    localStorage.setItem('reset_token_' + email, token);
    
    // Set expiry token 24 jam
    const expiry = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem('reset_token_expiry_' + email, expiry);
}


function resetPassword(email, token, newPassword) {
    // Validasi token
    const savedToken = localStorage.getItem('reset_token_' + email);
    const expiry = localStorage.getItem('reset_token_expiry_' + email);
    
    if (!savedToken || savedToken !== token) {
        return { success: false, message: 'Token reset tidak valid' };
    }
    
    if (Date.now() > expiry) {
        return { success: false, message: 'Token reset sudah kadaluarsa' };
    }
    
    // Cari user berdasarkan email
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex === -1) {
        return { success: false, message: 'Email tidak ditemukan' };
    }
    
    // Update password
    users[userIndex].password = newPassword;
    saveUsers();
    
    // Hapus token setelah digunakan
    localStorage.removeItem('reset_token_' + email);
    localStorage.removeItem('reset_token_expiry_' + email);
    
    return { success: true, message: 'Password berhasil direset' };
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Make functions available globally
window.viewEmployee = viewEmployee;
window.viewLeave = viewLeave;
window.cancelLeave = cancelLeave;
window.editUser = editUser;
window.deleteUser = deleteUser;
window.markNotificationAsRead = markNotificationAsRead;
window.approveLeave = approveLeave;
window.rejectLeave = rejectLeave;