import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { contactsApi } from "../api/client";
import {
  MessageSquare,
  Trash2,
  CheckCheck,
  Mail,
  MailOpen,
  RefreshCw,
  Search,
  Inbox,
} from "lucide-react";

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Contacts() {
  const [contacts, setContacts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [search, setSearch]         = useState("");
  const [filter, setFilter]         = useState("all"); // all | unread | read
  const [expanded, setExpanded]     = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchContacts = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await contactsApi.getAll();
      setContacts(res.data.contacts || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch {
      // handled by interceptor
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch shows the loading spinner
    fetchContacts(true);

    // Background focus and periodic checks run silently without wiping DOM
    const handleFocus = () => fetchContacts(false);
    window.addEventListener("focus", handleFocus);
    const interval = setInterval(() => fetchContacts(false), 20000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
    };
  }, []);

  const [deleteModalContact, setDeleteModalContact] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !deleting) setDeleteModalContact(null);
    };
    if (deleteModalContact) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deleteModalContact, deleting]);

  const handleMarkRead = async (id) => {
    setActionLoading(id + "_read");
    try {
      await contactsApi.markRead(id);
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isRead: true } : c))
      );
      setUnreadCount((n) => Math.max(0, n - 1));
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalContact) return;
    setDeleting(true);
    try {
      await contactsApi.delete(deleteModalContact.id);
      setContacts((prev) => prev.filter((c) => c.id !== deleteModalContact.id));
      if (!deleteModalContact.isRead) {
        setUnreadCount((n) => Math.max(0, n - 1));
      }
      setDeleteModalContact(null);
    } catch (err) {
      console.error("Failed to delete contact:", err);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = contacts.filter((c) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !c.isRead) ||
      (filter === "read" && c.isRead);
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.message.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-600/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Contact Messages</h1>
            <p className="text-slate-500 dark:text-gray-500 text-sm mt-0.5">
              {unreadCount > 0
                ? `${unreadCount} unread message${unreadCount !== 1 ? "s" : ""}`
                : "All messages read"}
            </p>
          </div>
        </div>
        <button
          onClick={() => fetchContacts(true)}
          className="btn-secondary gap-2 cursor-pointer"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* ── Filters + Search ── */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 rounded-xl p-1">
          {[
            { key: "all",    label: "All" },
            { key: "unread", label: "Unread" },
            { key: "read",   label: "Read" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === key
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200"
              }`}
            >
              {label}
              {key === "unread" && unreadCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-[10px] bg-white/20 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search messages…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 py-2"
          />
        </div>
      </div>

      {/* ── Message list ── */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4">
            <Inbox className="w-7 h-7 text-slate-400 dark:text-gray-600" />
          </div>
          <p className="text-slate-700 dark:text-gray-400 font-medium">No messages found</p>
          <p className="text-slate-500 dark:text-gray-600 text-sm mt-1">
            {filter !== "all" ? "Try changing the filter" : "No contact submissions yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((contact) => (
            <div
              key={contact.id}
              className={`card p-0 overflow-hidden transition-all duration-200 ${
                !contact.isRead ? "border-violet-300 dark:border-violet-500/20 ring-1 ring-violet-500/10" : ""
              }`}
            >
              {/* ── Message header (always visible) ── */}
              <button
                onClick={() => setExpanded((prev) => (prev === contact.id ? null : contact.id))}
                className="w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors"
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-gradient-to-br dark:from-violet-500/30 dark:to-indigo-500/20 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center text-violet-700 dark:text-violet-300 font-bold text-sm flex-shrink-0 mt-0.5">
                  {contact.name[0]?.toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-slate-900 dark:text-white font-semibold text-sm">{contact.name}</span>
                    <span className="text-slate-300 dark:text-gray-600 text-xs">·</span>
                    <span className="text-slate-500 dark:text-gray-400 text-xs">{contact.email}</span>
                    {!contact.isRead && (
                      <span className="badge-unread ml-auto">New</span>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-gray-400 text-xs mt-0.5 truncate">{contact.message}</p>
                  <p className="text-slate-400 dark:text-gray-500 text-[11px] mt-1">{formatDate(contact.createdAt)}</p>
                </div>

                <div className="flex-shrink-0 flex items-center gap-1 ml-2">
                  {contact.isRead ? (
                    <MailOpen className="w-4 h-4 text-slate-400 dark:text-gray-600" />
                  ) : (
                    <Mail className="w-4 h-4 text-violet-500 dark:text-violet-400" />
                  )}
                </div>
              </button>

              {/* ── Expanded message ── */}
              {expanded === contact.id && (
                <div className="px-5 pb-4 border-t border-slate-100 dark:border-white/5 transition-opacity duration-200">
                  <p className="text-slate-700 dark:text-gray-300 text-sm leading-relaxed mt-4 whitespace-pre-wrap">
                    {contact.message}
                  </p>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                    <a
                      href={`mailto:${contact.email}?subject=Re: Portfolio Contact`}
                      className="btn-secondary text-xs py-1.5 px-3"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Reply via Email
                    </a>

                    {!contact.isRead && (
                      <button
                        onClick={() => handleMarkRead(contact.id)}
                        disabled={actionLoading === contact.id + "_read"}
                        className="btn-secondary text-xs py-1.5 px-3 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        Mark as Read
                      </button>
                    )}

                    <button
                      onClick={() => setDeleteModalContact(contact)}
                      className="btn-danger text-xs py-1.5 px-3 ml-auto cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Small Delete Confirmation Modal (Full-screen Portal) ── */}
      {deleteModalContact &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/25 dark:bg-black/35 backdrop-blur-[2px] animate-fade-in"
            onClick={() => !deleting && setDeleteModalContact(null)}
          >
            <div
              className="w-full max-w-sm bg-white dark:bg-surface-50 border border-slate-200/90 dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 animate-slide-up relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/15 border border-red-200 dark:border-red-500/20 flex items-center justify-center flex-shrink-0 text-red-600 dark:text-red-400">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    Delete Message?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                    Are you sure you want to delete the message from{" "}
                    <span className="font-semibold text-slate-800 dark:text-gray-200">
                      {deleteModalContact.name}
                    </span>{" "}
                    ({deleteModalContact.email})?
                  </p>
                </div>
              </div>

              {/* Message Excerpt Preview */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-surface-100 border border-slate-200/80 dark:border-white/5 text-xs text-slate-600 dark:text-gray-300 italic line-clamp-3">
                "{deleteModalContact.message}"
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setDeleteModalContact(null)}
                  disabled={deleting}
                  className="btn-secondary text-xs py-2 px-3.5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-95 shadow-sm shadow-red-600/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Deleting…</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Message</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
