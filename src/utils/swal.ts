import Swal, { type SweetAlertIcon } from 'sweetalert2';

// กำหนดสีหลักของระบบ ( Indigo-600 และ Slate-400 )
const COLORS = {
    primary: '#4f46e5',
    secondary: '#94a3b8',
    danger: '#ef4444',
    success: '#10b981',
};

// คลาสพื้นฐานสำหรับ Popup
const baseOptions = {
    customClass: {
        popup: 'rounded-2xl shadow-xl border border-slate-100',
        confirmButton: 'px-6 py-2.5 rounded-xl font-bold text-sm transition-all focus:ring-4 focus:ring-indigo-500/20 mx-2',
        cancelButton: 'px-6 py-2.5 rounded-xl font-bold text-sm transition-all mx-2',
    },
    buttonsStyling: true, // ใช้สไตล์ปุ่มของ Swal แต่เราคุมสีเอง
};

export const useAlert = {
    // 1. แบบยืนยันการลบ หรือ Action สำคัญ (Confirmation)
    async confirm(title: string, text: string, icon: SweetAlertIcon = 'warning') {
        return Swal.fire({
            ...baseOptions,
            title,
            text,
            icon,
            showCancelButton: true,
            confirmButtonColor: COLORS.primary,
            cancelButtonColor: COLORS.secondary,
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            reverseButtons: true,
        });
    },

    // 2. แบบแจ้งเตือนสำเร็จ/ผิดพลาด ทั่วไป (Popup)
    async success(title: string, text?: string) {
        return Swal.fire({
            ...baseOptions,
            icon: 'success',
            title,
            text,
            confirmButtonColor: COLORS.primary,
        });
    },

    async error(title: string, text?: string) {
        return Swal.fire({
            ...baseOptions,
            icon: 'error',
            title,
            text,
            confirmButtonColor: COLORS.primary,
        });
    },

    // 3. แบบ Toast (เด้งมุมจอ ปิดเองอัตโนมัติ) - เหมาะสำหรับ Toggle Status หรือ Save เล็กๆ
    toast(title: string, icon: SweetAlertIcon = 'success') {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
            customClass: {
                popup: 'rounded-xl shadow-lg border border-slate-100',
            }
        });

        return Toast.fire({
            icon,
            title,
        });
    }
};