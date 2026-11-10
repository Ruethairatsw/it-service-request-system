// ========================================
// 1. INITIAL DATA
// ========================================

// ชื่อ Key สำหรับจัดเก็บข้อมูลใน LocalStorage
const STORAGE_KEY = "itServiceRequests";

// ข้อมูลตัวอย่างสำหรับแสดงบน Dashboard ครั้งแรก
const demoRequests = [
    {
        id: 1001,
        requester: "John Smith",
        title: "Internet Connection Problem",
        category: "Network",
        priority: "High",
        description: "Unable to connect to the office Wi-Fi.",
        status: "Pending",
        date: "2026-11-10"
    },
    {
        id: 1002,
        requester: "Sarah Johnson",
        title: "Software Installation",
        category: "Software",
        priority: "Medium",
        description: "Need Microsoft Office installation.",
        status: "In Progress",
        date: "2026-11-10"
    },
    {
        id: 1003,
        requester: "Michael Brown",
        title: "Computer Not Working",
        category: "Hardware",
        priority: "High",
        description: "Computer cannot start properly.",
        status: "Completed",
        date: "2026-11-09"
    },
    {
        id: 1004,
        requester: "Emily Davis",
        title: "Account Access Request",
        category: "Account Access",
        priority: "Low",
        description: "Request access to the company system.",
        status: "Pending",
        date: "2026-11-09"
    }
];


// ========================================
// 2. LOAD AND SAVE DATA
// ========================================

// โหลดข้อมูลจาก LocalStorage
function loadRequests() {

    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData !== null) {

        try {
            const parsedData = JSON.parse(savedData);

            if (Array.isArray(parsedData)) {
                return parsedData;
            }

        } catch (error) {
            console.error("Unable to load saved data:", error);
        }

    }

    // ถ้ายังไม่มีข้อมูล ให้ใช้ข้อมูลตัวอย่าง
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(demoRequests)
    );

    return [...demoRequests];
}


// ข้อมูลคำร้องทั้งหมด
let requests = loadRequests();


// บันทึกข้อมูลลง LocalStorage
function saveRequests() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(requests)
    );

}


// ========================================
// 3. PAGE NAVIGATION
// ========================================

function showPage(pageName) {

    // ซ่อนทุกหน้า
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    // แสดงหน้าที่เลือก
    const selectedPage = document.getElementById(
        pageName + "-page"
    );

    if (!selectedPage) return;

    selectedPage.classList.add("active");

    // เปลี่ยนสถานะเมนู
    document.querySelectorAll(".nav-link").forEach(link => {

        link.classList.remove("active");

        if (link.dataset.page === pageName) {
            link.classList.add("active");
        }

    });

    // เปลี่ยนหัวข้อด้านบน
    const pageTitles = {
        dashboard: {
            title: "Dashboard",
            description: "Overview of IT service requests"
        },

        requests: {
            title: "All Requests",
            description: "Manage and track IT service requests"
        },

        "new-request": {
            title: "New Request",
            description: "Submit a new IT service request"
        },        

        "request-details": {
            title: "Request Details",
            description: "View complete information about this service request"
        }
    };

    const pageInfo = pageTitles[pageName];

    if (pageInfo) {

        document.getElementById("page-title").textContent =
            pageInfo.title;

        document.getElementById("page-description").textContent =
            pageInfo.description;

    }

    // อัปเดตข้อมูลเมื่อเปลี่ยนหน้า
    if (pageName === "dashboard") {
        updateDashboard();
    }

    if (pageName === "requests") {
        renderRequests();
    }

}


// คลิกเมนูด้านซ้าย
document.querySelectorAll(".nav-link").forEach(link => {

    link.addEventListener("click", function(event) {

        event.preventDefault();

        showPage(this.dataset.page);

    });

});


// ========================================
// 4. CREATE NEW REQUEST
// ========================================

const requestForm = document.getElementById("request-form");

requestForm.addEventListener("submit", function(event) {

    event.preventDefault();

    // รับข้อมูลจากแบบฟอร์ม
    const requester = document.getElementById("requester").value.trim();

    const title = document.getElementById("title").value.trim();

    const category = document.getElementById("category").value;

    const priority = document.getElementById("priority").value;

    const description = document.getElementById("description").value.trim();


    // ตรวจสอบข้อมูล
    if (!requester || !title || !category || !priority || !description) {

        alert("Please complete all required fields.");

        return;

    }


    // สร้างข้อมูลคำร้องใหม่
    const newRequest = {

        id: Date.now(),

        requester: requester,

        title: title,

        category: category,

        priority: priority,

        description: description,

        status: "Pending",

        date: new Date().toISOString().slice(0, 10)

    };


    // เพิ่มข้อมูลลงในรายการ
    requests.unshift(newRequest);


    // บันทึกข้อมูล
    saveRequests();


    // ล้างแบบฟอร์ม
    requestForm.reset();


    // แจ้งผล
    alert("Request submitted successfully!");


    // กลับไปหน้า Dashboard
    showPage("dashboard");

});


// ========================================
// 5. SAFE HTML TEXT
// ========================================

// ป้องกันข้อความที่ผู้ใช้กรอก
// ไม่ให้ถูกตีความเป็น HTML
function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];

    });

}


// ========================================
// 6. STATUS AND PRIORITY LABELS
// ========================================

function getStatusClass(status) {

    if (status === "Pending") return "pending";

    if (status === "In Progress") return "in-progress";

    if (status === "Completed") return "completed";

    return "";

}


function getPriorityClass(priority) {

    if (priority === "High") return "high";

    if (priority === "Medium") return "medium";

    if (priority === "Low") return "low";

    return "";

}


// ========================================
// 7. DISPLAY REQUEST TABLE
// ========================================

function renderRequestTable(container, data) {

    if (data.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <h3>No requests found</h3>
                <p>There are no service requests to display.</p>
            </div>
        `;

        return;

    }


    let tableHTML = `

        <div class="table-wrapper">

            <table class="request-table">

                <thead>

                    <tr>
                        <th>Request</th>
                        <th>Requester</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>

                </thead>

                <tbody>

    `;


    data.forEach(request => {

        const statusClass = getStatusClass(request.status);

        const priorityClass = getPriorityClass(request.priority);

        tableHTML += `

            <tr>

                <td>
                    <strong>${escapeHTML(request.title)}</strong>
                    <small>#${request.id}</small>
                </td>

                <td>${escapeHTML(request.requester)}</td>

                <td>${escapeHTML(request.category)}</td>

                <td>
                    <span class="priority ${priorityClass}">
                        ${escapeHTML(request.priority)}
                    </span>
                </td>

                <td>
                    <span class="status ${statusClass}">
                        ${escapeHTML(request.status)}
                    </span>
                </td>

                <td>${escapeHTML(request.date)}</td>

                <td>
                <button
    class="edit-btn"
    onclick="editRequest(${request.id})"
>
    
<button
    class="edit-btn"
    onclick="editRequest(${request.id})"
>
    Edit
</button>

<button
    class="action-btn"
    onclick="viewRequest(${request.id})"
>
    View
</button>

<button
    class="delete-btn"
    onclick="deleteRequest(${request.id})"
>
    Delete
</button>

                    </button>
                </td>

            </tr>

        `;

    });


    tableHTML += `

                </tbody>

            </table>

        </div>

    `;


    container.innerHTML = tableHTML;

}


// ========================================
// 8. ALL REQUESTS
// ========================================

function renderRequests() {

    const container = document.getElementById("request-list");

    renderRequestTable(container, getFilteredRequests());

}


// ค้นหาและกรองข้อมูล
function getFilteredRequests() {

    const searchInput = document.getElementById("search-input");

    const statusFilter = document.getElementById("status-filter");

    const searchText = searchInput.value.toLowerCase().trim();

    const selectedStatus = statusFilter.value;


    return requests.filter(request => {

        const matchesSearch = [

            request.title,

            request.requester,

            request.category,

            request.description

        ].some(value =>

            String(value).toLowerCase().includes(searchText)

        );


        const matchesStatus =

            selectedStatus === "All" ||

            request.status === selectedStatus;


        return matchesSearch && matchesStatus;

    });

}


// ค้นหาขณะพิมพ์
document.getElementById("search-input").addEventListener(
    "input",
    renderRequests
);


// กรองตามสถานะ
document.getElementById("status-filter").addEventListener(
    "change",
    renderRequests
);


// ========================================
// 9. VIEW AND UPDATE REQUEST
// ========================================


function viewRequest(id) {

    const request = requests.find(item => item.id === id);

    if (!request) {
        alert("Request not found.");
        return;
    }

    document.getElementById("detail-id").textContent = request.id;
    document.getElementById("detail-requester").textContent = request.requester;
    document.getElementById("detail-title").textContent = request.title;
    document.getElementById("detail-category").textContent = request.category;
    const priorityElement = document.getElementById("detail-priority");
const statusElement = document.getElementById("detail-status");

priorityElement.textContent = request.priority;
priorityElement.className = "priority " + request.priority.toLowerCase();

statusElement.textContent = request.status;
statusElement.className = "status " + request.status.toLowerCase().replace(" ", "-");
    document.getElementById("detail-date").textContent = request.date;
    document.getElementById("detail-description").textContent = request.description;

    showPage("request-details");

}



// ========================================
// 10. DELETE REQUEST
// ========================================


function editRequest(id) {
    const request = requests.find(item => item.id === id);

    if (!request) {
        alert("Request not found.");
        return;
    }

    const newRequester = prompt(
        "Edit Requester Name:",
        request.requester
    );

    if (newRequester === null) return;

    const newTitle = prompt(
        "Edit Request Title:",
        request.title
    );

    if (newTitle === null) return;

    const newCategory = prompt(
        "Edit Category (Hardware, Software, Network, Account Access, Other):",
        request.category
    );

    if (newCategory === null) return;

    const newPriority = prompt(
        "Edit Priority (Low, Medium, High):",
        request.priority
    );

    if (newPriority === null) return;

    const newDescription = prompt(
        "Edit Description:",
        request.description
    );

    if (newDescription === null) return;

    if (
        !newRequester.trim() ||
        !newTitle.trim() ||
        !newDescription.trim()
    ) {
        alert("Please fill in all required fields.");
        return;
    }

    const validCategories = [
        "Hardware",
        "Software",
        "Network",
        "Account Access",
        "Other"
    ];

    const validPriorities = ["Low", "Medium", "High"];

    if (!validCategories.includes(newCategory.trim())) {
        alert("Invalid category.");
        return;
    }

    if (!validPriorities.includes(newPriority.trim())) {
        alert("Invalid priority.");
        return;
    }

    request.requester = newRequester.trim();
    request.title = newTitle.trim();
    request.category = newCategory.trim();
    request.priority = newPriority.trim();
    request.description = newDescription.trim();

    saveRequests();
    renderRequests();
    updateDashboard();

    alert("Request updated successfully!");
}

function deleteRequest(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this request?"
    );

    if (!confirmed) return;


    requests = requests.filter(request => request.id !== id);


    saveRequests();

    renderRequests();

    updateDashboard();


}


// ========================================
// 11. DASHBOARD STATISTICS
// ========================================

function updateDashboard() {

    const total = requests.length;


    const pending = requests.filter(request =>

        request.status === "Pending"

    ).length;


    const inProgress = requests.filter(request =>

        request.status === "In Progress"

    ).length;


    const completed = requests.filter(request =>

        request.status === "Completed"

    ).length;


    // แสดงตัวเลขบน Dashboard
    document.getElementById("total-count").textContent = total;

    document.getElementById("pending-count").textContent = pending;

    document.getElementById("progress-count").textContent = inProgress;

    document.getElementById("completed-count").textContent = completed;


    // แสดงรายการล่าสุด
    const recentRequests = requests.slice(0, 5);

    renderRequestTable(

        document.getElementById("recent-requests"),

        recentRequests

    );


    // อัปเดตกราฟ
    updateChart(pending, inProgress, completed);

}


// ========================================
// 12. DASHBOARD CHART
// ========================================

let requestChart = null;


function updateChart(pending, inProgress, completed) {

    const canvas = document.getElementById("requestChart");

    if (!canvas) return;


    // ถ้ามีกราฟเก่า ให้ลบทิ้งก่อน
    if (requestChart) {

        requestChart.destroy();

    }


    requestChart = new Chart(canvas, {

        type: "doughnut",

        data: {

            labels: [

                "Pending",

                "In Progress",

                "Completed"

            ],

            datasets: [{

                data: [

                    pending,

                    inProgress,

                    completed

                ],

                backgroundColor: [

                    "#F5B942",

                    "#3978ED",

                    "#20B486"

                ],

                borderWidth: 0,

                hoverOffset: 8

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: "68%",

            plugins: {

                legend: {

                    position: "bottom",

                    labels: {

                        usePointStyle: true,

                        padding: 20,

                        font: {

                            size: 12

                        }

                    }

                }

            }

        }

    });

}


// ========================================
// 13. INITIALIZE WEBSITE
// ========================================

// เริ่มต้นเว็บไซต์
function initializeApp() {

    updateDashboard();

    renderRequests();

    showPage("dashboard");

}


// เรียกใช้เมื่อโหลดหน้าเว็บเสร็จ
document.addEventListener("DOMContentLoaded", initializeApp);