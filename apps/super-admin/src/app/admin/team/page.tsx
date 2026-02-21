"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firestore";
import {
    collection,
    getDocs,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
} from "firebase/firestore";
import { AdminUser, AdminRole } from "@/types";
import {
    PERMISSION_KEYS,
    PERMISSION_LABELS,
    DEFAULT_PERMISSIONS,
    PermissionKey,
    isSuperAdmin,
} from "@/lib/permissions";
import {
    UserPlus,
    Shield,
    ShieldCheck,
    ShieldAlert,
    Check,
    X,
    Pencil,
    Trash2,
    Users,
    ToggleLeft,
    ToggleRight,
} from "lucide-react";
import toast from "react-hot-toast";

export default function TeamPage() {
    const { adminRole, userEmail } = useAuth();
    const [members, setMembers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);

    // Add / Edit form state
    const [showForm, setShowForm] = useState(false);
    const [editingUid, setEditingUid] = useState<string | null>(null);
    const [formEmail, setFormEmail] = useState("");
    const [formName, setFormName] = useState("");
    const [formRole, setFormRole] = useState<AdminRole>("staff");
    const [formPermissions, setFormPermissions] = useState<PermissionKey[]>([]);
    const [saving, setSaving] = useState(false);

    const isReadOnly = adminRole !== "super_admin";

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const q = query(collection(db, "adminUsers"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map((d) => ({ ...d.data(), uid: d.id } as AdminUser));
            setMembers(data);
        } catch (error) {
            console.error("Error fetching team:", error);
            toast.error("Failed to load team members");
        } finally {
            setLoading(false);
        }
    };

    const openAddForm = () => {
        setEditingUid(null);
        setFormEmail("");
        setFormName("");
        setFormRole("staff");
        setFormPermissions([...DEFAULT_PERMISSIONS.staff]);
        setShowForm(true);
    };

    const openEditForm = (member: AdminUser) => {
        setEditingUid(member.uid);
        setFormEmail(member.email);
        setFormName(member.name);
        setFormRole(member.role);
        setFormPermissions(member.permissions as PermissionKey[]);
        setShowForm(true);
    };

    const handleRoleChange = (role: AdminRole) => {
        setFormRole(role);
        setFormPermissions([...DEFAULT_PERMISSIONS[role]]);
    };

    const togglePermission = (perm: PermissionKey) => {
        setFormPermissions((prev) =>
            prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
        );
    };

    const handleSave = async () => {
        if (!formEmail.trim()) {
            toast.error("Email is required");
            return;
        }
        if (!formName.trim()) {
            toast.error("Name is required");
            return;
        }

        setSaving(true);
        try {
            if (editingUid) {
                // Update existing
                await updateDoc(doc(db, "adminUsers", editingUid), {
                    name: formName.trim(),
                    role: formRole,
                    permissions: formPermissions,
                    updatedAt: new Date().toISOString(),
                });
                toast.success("Team member updated!");
            } else {
                // Add new — use email as a temporary doc ID (will be replaced when user logs in)
                // We create a placeholder doc. When the user signs in with Firebase Auth,
                // the AuthContext will need to match by email.
                const docId = formEmail.trim().toLowerCase().replace(/[^a-z0-9]/g, "_");
                await setDoc(doc(db, "adminUsers", docId), {
                    uid: docId,
                    email: formEmail.trim().toLowerCase(),
                    name: formName.trim(),
                    role: formRole,
                    permissions: formPermissions,
                    isActive: true,
                    createdAt: new Date().toISOString(),
                    createdBy: userEmail,
                });
                toast.success("Team member added! They can now sign in.");
            }

            setShowForm(false);
            fetchMembers();
        } catch (error) {
            console.error("Error saving member:", error);
            toast.error("Failed to save");
        } finally {
            setSaving(false);
        }
    };

    const toggleActive = async (member: AdminUser) => {
        if (isSuperAdmin(member.email)) {
            toast.error("Cannot deactivate the Super Admin");
            return;
        }
        try {
            await updateDoc(doc(db, "adminUsers", member.uid), {
                isActive: !member.isActive,
                updatedAt: new Date().toISOString(),
            });
            toast.success(member.isActive ? "Member deactivated" : "Member activated");
            fetchMembers();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (member: AdminUser) => {
        if (isSuperAdmin(member.email)) {
            toast.error("Cannot delete the Super Admin");
            return;
        }
        if (!confirm(`Remove ${member.name} (${member.email}) from the team?`)) return;

        try {
            await deleteDoc(doc(db, "adminUsers", member.uid));
            toast.success("Member removed");
            fetchMembers();
        } catch (error) {
            toast.error("Failed to remove member");
        }
    };

    const roleIcon = (role: AdminRole) => {
        switch (role) {
            case "super_admin":
                return <ShieldAlert className="h-4 w-4 text-purple-600" />;
            case "manager":
                return <ShieldCheck className="h-4 w-4 text-blue-600" />;
            case "staff":
                return <Shield className="h-4 w-4 text-green-600" />;
        }
    };

    const roleBadgeColor = (role: AdminRole) => {
        switch (role) {
            case "super_admin":
                return "bg-purple-100 text-purple-700";
            case "manager":
                return "bg-blue-100 text-blue-700";
            case "staff":
                return "bg-green-100 text-green-700";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
                    <p className="text-gray-600 mt-1">
                        {isReadOnly
                            ? "View team members and their roles"
                            : "Manage admin users, roles, and permissions"}
                    </p>
                </div>
                {!isReadOnly && (
                    <button
                        onClick={openAddForm}
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-sm transition-colors"
                    >
                        <UserPlus className="h-4 w-4" />
                        Add Member
                    </button>
                )}
            </div>

            {/* Add / Edit Form */}
            {showForm && !isReadOnly && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {editingUid ? "Edit Member" : "Add New Admin Member"}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={formEmail}
                                onChange={(e) => setFormEmail(e.target.value)}
                                disabled={!!editingUid}
                                placeholder="user@example.com"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500 text-gray-900"
                            />
                            {!editingUid && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Must have a Firebase Auth account first
                                </p>
                            )}
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Display Name
                            </label>
                            <input
                                type="text"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                            />
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Role
                        </label>
                        <div className="flex gap-3">
                            {(["manager", "staff"] as AdminRole[]).map((role) => (
                                <button
                                    key={role}
                                    onClick={() => handleRoleChange(role)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${formRole === role
                                        ? "border-primary-500 bg-primary-50 text-primary-700"
                                        : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
                                        }`}
                                >
                                    {roleIcon(role)}
                                    {role === "manager" ? "Manager" : "Staff"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Permissions Grid */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Permissions
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {PERMISSION_KEYS.filter((k) => k !== "team" || formRole === "manager").map(
                                (perm) => (
                                    <label
                                        key={perm}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm transition-colors ${formPermissions.includes(perm)
                                            ? "border-primary-300 bg-primary-50 text-primary-700"
                                            : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50"
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formPermissions.includes(perm)}
                                            onChange={() => togglePermission(perm)}
                                            className="sr-only"
                                        />
                                        <div
                                            className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${formPermissions.includes(perm)
                                                ? "bg-primary-600 border-primary-600"
                                                : "border-gray-300"
                                                }`}
                                        >
                                            {formPermissions.includes(perm) && (
                                                <Check className="h-3 w-3 text-white" />
                                            )}
                                        </div>
                                        {PERMISSION_LABELS[perm]}
                                    </label>
                                )
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-sm disabled:opacity-50 transition-colors"
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Check className="h-4 w-4" />
                                    {editingUid ? "Update" : "Add Member"}
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => setShowForm(false)}
                            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Members List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Member
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Permissions
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Status
                                </th>
                                {!isReadOnly && (
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {members.length === 0 ? (
                                <tr>
                                    <td colSpan={isReadOnly ? 4 : 5} className="px-6 py-12 text-center">
                                        <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">No team members yet</p>
                                    </td>
                                </tr>
                            ) : (
                                members.map((member) => {
                                    const isSA = isSuperAdmin(member.email);
                                    return (
                                        <tr key={member.uid} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">{member.name}</p>
                                                    <p className="text-sm text-gray-500">{member.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${roleBadgeColor(
                                                        member.role
                                                    )}`}
                                                >
                                                    {roleIcon(member.role)}
                                                    {member.role === "super_admin"
                                                        ? "Super Admin"
                                                        : member.role === "manager"
                                                            ? "Manager"
                                                            : "Staff"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1 max-w-[300px]">
                                                    {(member.permissions || []).slice(0, 4).map((p) => (
                                                        <span
                                                            key={p}
                                                            className="inline-block px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded"
                                                        >
                                                            {PERMISSION_LABELS[p as PermissionKey] || p}
                                                        </span>
                                                    ))}
                                                    {(member.permissions || []).length > 4 && (
                                                        <span className="inline-block px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded">
                                                            +{member.permissions.length - 4} more
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${member.isActive
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {member.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            {!isReadOnly && (
                                                <td className="px-6 py-4 text-right">
                                                    {!isSA && (
                                                        <div className="flex items-center justify-end gap-1">
                                                            <button
                                                                onClick={() => openEditForm(member)}
                                                                className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                                                                title="Edit"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => toggleActive(member)}
                                                                className={`p-2 rounded-lg ${member.isActive
                                                                    ? "text-yellow-600 hover:bg-yellow-50"
                                                                    : "text-green-600 hover:bg-green-50"
                                                                    }`}
                                                                title={member.isActive ? "Deactivate" : "Activate"}
                                                            >
                                                                {member.isActive ? (
                                                                    <ToggleRight className="h-4 w-4" />
                                                                ) : (
                                                                    <ToggleLeft className="h-4 w-4" />
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(member)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                                title="Remove"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
