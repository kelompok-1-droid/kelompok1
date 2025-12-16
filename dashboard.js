// dashboard.js - Data khusus untuk dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Simulasi data user yang sedang login
    const currentUser = {
        id: 1,
        fullname: "Budi Santoso",
        role: "pegawai",
        position: "Staff IT",
        salary: 8500000, // Gaji berbeda per user
        performance: [
            { periode: "November 2025", target: "95%", pencapaian: "92%", nilai: "A-" },
            { periode: "Desember 2025", target: "95%", pencapaian: "97%", nilai: "A" },
            { periode: "Januari 2025", target: "95%", pencapaian: "90%", nilai: "B+" }
        ]
    };

// Di dalam fungsi displayDashboardStats():
function displayDashboardStats() {
    const key = `attendance_${currentUser.id}`;
    const data = JSON.parse(localStorage.getItem(key)) || [];
    const today = new Date().toISOString().split('T')[0];

    const todayData = data.filter(item => item.date === today);
    const presentToday = todayData.filter(item => item.status === 'Hadir').length;

    document.getElementById('present-today').textContent = presentToday;
}

    // Fungsi untuk menampilkan gaji user
    function displayUserSalary() {
        const salaryElement = document.getElementById('my-salary');
        if (salaryElement) {
            // Format gaji ke format Rupiah
            const formattedSalary = formatRupiah(currentUser.salary);
            salaryElement.textContent = `Rp ${formattedSalary}`;
        }
    }

    // Fungsi untuk menampilkan data kinerja
    function displayPerformanceSummary() {
        const performanceTbody = document.getElementById('my-performance-summary');
        if (performanceTbody) {
            performanceTbody.innerHTML = '';
            
            currentUser.performance.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.periode}</td>
                    <td>${item.target}</td>
                    <td>${item.pencapaian}</td>
                    <td><span class="status-badge ${getGradeColor(item.nilai)}">${item.nilai}</span></td>
                `;
                performanceTbody.appendChild(row);
            });
        }
    }

    // Fungsi untuk mendapatkan warna berdasarkan nilai
    function getGradeColor(grade) {
        if (grade.includes('A')) return 'success';
        if (grade.includes('B')) return 'info';
        if (grade.includes('C')) return 'warning';
        return 'danger';
    }

    // Fungsi format Rupiah
    function formatRupiah(angka) {
        return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // Fungsi untuk mengupdate info user di sidebar dan top bar
    function updateUserInfo() {
        // Update di sidebar
        const userFullname = document.getElementById('user-fullname');
        const userRole = document.getElementById('user-role');
        const userAvatar = document.getElementById('user-avatar');
        
        if (userFullname) userFullname.textContent = currentUser.fullname;
        if (userRole) userRole.textContent = currentUser.position;
        if (userAvatar) {
            // Ambil inisial dari nama
            const initials = currentUser.fullname
                .split(' ')
                .map(name => name[0])
                .join('')
                .toUpperCase();
            userAvatar.textContent = initials.substring(0, 2);
        }

        // Update di top bar
        const topUserFullname = document.getElementById('top-user-fullname');
        const topUserRole = document.getElementById('top-user-role');
        const topUserAvatar = document.getElementById('top-user-avatar');
        
        if (topUserFullname) topUserFullname.textContent = currentUser.fullname;
        if (topUserRole) topUserRole.textContent = currentUser.position;
        if (topUserAvatar) {
            const initials = currentUser.fullname
                .split(' ')
                .map(name => name[0])
                .join('')
                .toUpperCase();
            topUserAvatar.textContent = initials.substring(0, 2);
        }
    }

    // Fungsi untuk mengatur menu berdasarkan role
    function setupMenuBasedOnRole() {
        const adminMenu = document.getElementById('admin-menu');
        const employeeMenu = document.getElementById('employee-menu');
        const adminQuickActions = document.getElementById('admin-quick-actions');
        const employeeQuickActions = document.getElementById('employee-quick-actions');

        if (currentUser.role === 'admin') {
            if (adminMenu) adminMenu.classList.remove('hidden');
            if (employeeMenu) employeeMenu.classList.add('hidden');
            if (adminQuickActions) adminQuickActions.classList.remove('hidden');
            if (employeeQuickActions) employeeQuickActions.classList.add('hidden');
        } else {
            if (adminMenu) adminMenu.classList.add('hidden');
            if (employeeMenu) employeeMenu.classList.remove('hidden');
            if (adminQuickActions) adminQuickActions.classList.add('hidden');
            if (employeeQuickActions) employeeQuickActions.classList.remove('hidden');
        }
    }

    // Event listener untuk link "Lihat Detail" pada kinerja
    const viewPerformanceLink = document.getElementById('view-my-performance');
    if (viewPerformanceLink) {
        viewPerformanceLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Navigasi ke halaman Kinerja Saya
            const menuItems = document.querySelectorAll('.menu-item');
            menuItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('data-page') === 'my-performance') {
                    item.classList.add('active');
                }
            });

            const pageContents = document.querySelectorAll('.page-content');
            pageContents.forEach(page => page.classList.remove('active'));
            document.getElementById('my-performance-content').classList.add('active');

            // Update judul halaman
            document.getElementById('page-title').textContent = 'Kinerja Saya';
            document.getElementById('page-description').textContent = 'Pantau dan kelola penilaian kinerja Anda.';
        });
    }

    // Inisialisasi
    updateUserInfo();
    displayUserSalary();
    displayPerformanceSummary();
    setupMenuBasedOnRole();

    // Simulasi data statistik dashboard
    setTimeout(() => {
        const totalEmployees = document.getElementById('total-employees');
        const presentToday = document.getElementById('present-today');
        const onLeave = document.getElementById('on-leave');
        
        if (totalEmployees) totalEmployees.textContent = '127';
        if (presentToday) presentToday.textContent = '89';
        if (onLeave) onLeave.textContent = '15';
    }, 500);

    console.log('Dashboard initialized for:', currentUser.fullname);
});

// Contoh untuk user berbeda
const usersData = {
    // Manager
    manager1: {
        fullname: "Siti Nurhaliza",
        role: "pegawai",
        position: "Manager HRD",
        salary: 15000000,
        performance: [
            { periode: "November 2025", target: "95%", pencapaian: "96%", nilai: "A" },
            { periode: "Desember 2025", target: "95%", pencapaian: "94%", nilai: "A-" }
        ]
    },
    
    // Staff
    staff1: {
        fullname: "Budi Santoso",
        role: "pegawai",
        position: "Staff IT",
        salary: 8500000,
        performance: [
            { periode: "November 2025", target: "90%", pencapaian: "92%", nilai: "A-" },
            { periode: "Desember 2025", target: "90%", pencapaian: "97%", nilai: "A" }
        ]
    }
};