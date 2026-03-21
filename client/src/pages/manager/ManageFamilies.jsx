import { useState, useEffect } from 'react';
import { familiesAPI, membersAPI } from '../../services/api.js';
import { Users, Plus, Printer, X, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageFamilies() {
    const [families, setFamilies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [form, setForm] = useState({ name: '', description: '' });
    const [allMembers, setAllMembers] = useState([]);
    const [memberModal, setMemberModal] = useState({ show: false, familyId: null, member: null });
    const [isNewMember, setIsNewMember] = useState(false);
    const [memberForm, setMemberForm] = useState({ 
        member_id: '', 
        role: 'child',
        full_name: '',
        phone: '',
        national_id: '',
        home_location: ''
    });

    useEffect(() => { load(); loadMembers(); }, []);
    const load = async () => { try { setFamilies(await familiesAPI.getAll()); } catch { setFamilies([]); } finally { setLoading(false); } };
    const loadMembers = async () => { try { setAllMembers(await membersAPI.getAll()); } catch { setAllMembers([]); } };

    const handleCreate = async (e) => {
        e.preventDefault();
        try { await familiesAPI.create(form); toast.success('Family created'); setShowCreate(false); setForm({ name: '', description: '' }); load(); }
        catch (err) { toast.error(err.message); }
    };

    const handleMemberSubmit = async (e) => {
        e.preventDefault();
        try {
            let finalMemberId = memberForm.member_id;

            if (!memberModal.member && isNewMember) {
                // Create new member first
                const newMember = await membersAPI.create({
                    full_name: memberForm.full_name,
                    phone: memberForm.phone,
                    national_id: memberForm.national_id,
                    home_location: memberForm.home_location
                });
                finalMemberId = newMember.id;
                loadMembers(); // Refresh members list
            }

            if (memberModal.member) {
                await familiesAPI.updateMemberRole(memberModal.familyId, memberModal.member.member_id, { role: memberForm.role });
                toast.success('Role updated');
            } else {
                await familiesAPI.addMember(memberModal.familyId, { 
                    member_id: finalMemberId, 
                    role: memberForm.role 
                });
                toast.success('Member added to family');
            }
            setMemberModal({ show: false, familyId: null, member: null });
            load();
        } catch (err) { toast.error(err.message); }
    };

    const handleRemoveMember = async (familyId, memberId) => {
        if (!confirm('Are you sure you want to remove this member from the family?')) return;
        try {
            await familiesAPI.removeMember(familyId, memberId);
            toast.success('Member removed');
            load();
        } catch (err) { toast.error(err.message); }
    };

    const printFamily = (family) => {
        const members = family.family_members || [];
        const content = `<html><head><title>${family.name}</title><style>body{font-family:Arial;padding:2rem}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f4f4f4}</style></head>
    <body><h1>${family.name}</h1><p>${family.description || ''}</p>
    <table><tr><th>#</th><th>Member Name</th><th>Role</th></tr>
    ${members.map((fm, i) => `<tr><td>${i + 1}</td><td>${fm.members?.full_name || 'N/A'}</td><td>${fm.role}</td></tr>`).join('')}
    </table></body></html>`;
        const win = window.open('', '_blank');
        win.document.write(content);
        win.document.close();
        win.print();
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Church Families</h1>
                    <p className="page-subtitle">Manage the five main family groups</p>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}><Plus size={16} /> New Family</button>
            </div>

            <style>{`
        .family-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem; }
        .family-card { transition: all var(--transition-base); }
        .family-card:hover { border-color: rgba(37, 99, 235, 0.2); transform: translateY(-2px); }
        .family-members-list { margin-top: 1rem; }
        .family-member-item {
          display: flex; justify-content: space-between; align-items: center;
          padding: 0.5rem 0; border-bottom: 1px solid var(--color-border); font-size: 0.9rem;
        }
        .family-member-item:last-child { border-bottom: none; }
      `}</style>

            {loading ? <div className="loading-page"><div className="spinner" /></div> : families.length === 0 ? (
                <div className="empty-state"><Users size={64} /><h3>No families yet</h3><p>Create your first church family group.</p></div>
            ) : (
                <div className="family-grid">
                    {families.map(f => (
                        <div key={f.id} className="card family-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}>{f.name}</h3>
                                    {f.description && <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{f.description}</p>}
                                </div>
                                <div style={{ display: 'flex', gap: '0.25rem' }}>
                                    <button className="btn btn-ghost btn-sm" onClick={() => {
                                        setMemberModal({ show: true, familyId: f.id, member: null });
                                        setIsNewMember(false);
                                        setMemberForm({ member_id: '', role: 'child', full_name: '', phone: '', national_id: '', home_location: '' });
                                    }} title="Add member"><UserPlus size={16} /></button>
                                    <button className="btn btn-ghost btn-sm" onClick={() => printFamily(f)} title="Print members"><Printer size={16} /></button>
                                </div>
                            </div>
                            <div style={{ marginTop: '0.75rem' }}>
                                <span className="badge badge-primary">{(f.family_members || []).length} Members</span>
                            </div>
                            <div className="family-members-list">
                                {(f.family_members || []).length === 0 ? (
                                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No members yet</p>
                                ) : (f.family_members || []).map(fm => (
                                    <div key={fm.id} className="family-member-item">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ color: 'var(--color-text)' }}>{fm.members?.full_name || 'Unknown'}</span>
                                            <span className={`badge ${fm.role === 'parent' ? 'badge-primary' : 'badge-info'}`}>{fm.role}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            <button 
                                                className="btn btn-ghost btn-icon btn-xs" 
                                                onClick={() => {
                                                    setMemberModal({ show: true, familyId: f.id, member: fm });
                                                    setMemberForm({ member_id: fm.member_id, role: fm.role });
                                                }}
                                                title="Edit role"
                                            >
                                                <Plus size={12} style={{ transform: 'rotate(45deg)' }} />
                                            </button>
                                            <button 
                                                className="btn btn-ghost btn-icon btn-xs" 
                                                style={{ color: 'var(--color-error, #ff4d4f)' }}
                                                onClick={() => handleRemoveMember(f.id, fm.member_id)}
                                                title="Remove member"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showCreate && (
                <div className="modal-overlay" onClick={() => setShowCreate(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header"><h2>Create Family</h2><button className="btn btn-ghost btn-icon" onClick={() => setShowCreate(false)}><X size={20} /></button></div>
                        <div className="modal-body">
                            <form onSubmit={handleCreate}>
                                <div className="form-group"><label className="form-label">Family Name</label><input className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                                <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                                <div className="modal-footer" style={{ padding: 0, marginTop: '1rem' }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Create Family</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {memberModal.show && (
                <div className="modal-overlay" onClick={() => setMemberModal({ show: false, familyId: null, member: null })}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{memberModal.member ? 'Edit Member Role' : 'Add Member to Family'}</h2>
                            <button className="btn btn-ghost btn-icon" onClick={() => setMemberModal({ show: false, familyId: null, member: null })}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleMemberSubmit}>
                                {!memberModal.member && (
                                    <>
                                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
                                            <button 
                                                type="button" 
                                                className={`btn btn-sm ${!isNewMember ? 'btn-primary' : 'btn-ghost'}`} 
                                                style={{ flex: 1 }}
                                                onClick={() => setIsNewMember(false)}
                                            >Existing Member</button>
                                            <button 
                                                type="button" 
                                                className={`btn btn-sm ${isNewMember ? 'btn-primary' : 'btn-ghost'}`} 
                                                style={{ flex: 1 }}
                                                onClick={() => setIsNewMember(true)}
                                            >New Member</button>
                                        </div>

                                        {!isNewMember ? (
                                            <div className="form-group">
                                                <label className="form-label">Select Member</label>
                                                <select 
                                                    className="form-input" 
                                                    required 
                                                    value={memberForm.member_id} 
                                                    onChange={e => setMemberForm({ ...memberForm, member_id: e.target.value })}
                                                >
                                                    <option value="">Select a member...</option>
                                                    {allMembers
                                                        .filter(m => {
                                                            const family = families.find(f => f.id === memberModal.familyId);
                                                            const isAlreadyIn = (family?.family_members || []).some(fm => fm.member_id === m.id);
                                                            return !isAlreadyIn;
                                                        })
                                                        .map(m => (
                                                            <option key={m.id} value={m.id}>{m.full_name}</option>
                                                        ))
                                                    }
                                                </select>
                                                {allMembers.length > 0 && allMembers.filter(m => {
                                                    const family = families.find(f => f.id === memberModal.familyId);
                                                    return (family?.family_members || []).some(fm => fm.member_id === m.id);
                                                }).length > 0 && (
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                                                        Note: Members already in this family are hidden.
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                <div className="form-group">
                                                    <label className="form-label">Full Name</label>
                                                    <input 
                                                        className="form-input" 
                                                        required 
                                                        placeholder="Member's full name"
                                                        value={memberForm.full_name} 
                                                        onChange={e => setMemberForm({ ...memberForm, full_name: e.target.value })}
                                                    />
                                                </div>
                                                <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                    <div>
                                                        <label className="form-label">Phone</label>
                                                        <input 
                                                            className="form-input" 
                                                            placeholder="Phone number"
                                                            value={memberForm.phone} 
                                                            onChange={e => setMemberForm({ ...memberForm, phone: e.target.value })}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="form-label">National ID</label>
                                                        <input 
                                                            className="form-input" 
                                                            placeholder="ID number"
                                                            value={memberForm.national_id} 
                                                            onChange={e => setMemberForm({ ...memberForm, national_id: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Home Location</label>
                                                    <input 
                                                        className="form-input" 
                                                        placeholder="Village, District, etc."
                                                        value={memberForm.home_location} 
                                                        onChange={e => setMemberForm({ ...memberForm, home_location: e.target.value })}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                                <div className="form-group">
                                    <label className="form-label">Role</label>
                                    <select 
                                        className="form-input" 
                                        required 
                                        value={memberForm.role} 
                                        onChange={e => setMemberForm({ ...memberForm, role: e.target.value })}
                                    >
                                        <option value="parent">Parent</option>
                                        <option value="child">Child</option>
                                    </select>
                                </div>
                                <div className="modal-footer" style={{ padding: 0, marginTop: '1rem' }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setMemberModal({ show: false, familyId: null, member: null })}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">
                                        {memberModal.member ? 'Update Role' : 'Add Member'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
