import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";

type MembershipRole = "OWNER" | "ADMIN" | "MEMBER" | "SUPPORT" | "SALES" | "HR";

type Tenant = { id: string; name: string; slug: string; createdAt: Date };
type User = {
  id: string;
  email: string;
  passwordHash: string;
  fullName?: string;
  isActive: boolean;
  createdAt: Date;
};
type Membership = { id: string; tenantId: string; userId: string; role: MembershipRole; createdAt: Date };

@Injectable()
export class InMemoryAuthStore {
  private tenantsById = new Map<string, Tenant>();
  private tenantsBySlug = new Map<string, Tenant>();
  private usersById = new Map<string, User>();
  private usersByEmail = new Map<string, User>();
  private memberships: Membership[] = [];

  createTenant(input: { name: string; slug: string }) {
    if (this.tenantsBySlug.has(input.slug)) {
      throw new Error("Tenant slug already in use");
    }
    const t: Tenant = { id: randomUUID(), name: input.name, slug: input.slug, createdAt: new Date() };
    this.tenantsById.set(t.id, t);
    this.tenantsBySlug.set(t.slug, t);
    return t;
  }

  createUser(input: { email: string; passwordHash: string; fullName?: string }) {
    if (this.usersByEmail.has(input.email)) {
      throw new Error("Email already in use");
    }
    const u: User = {
      id: randomUUID(),
      email: input.email,
      passwordHash: input.passwordHash,
      fullName: input.fullName,
      isActive: true,
      createdAt: new Date(),
    };
    this.usersById.set(u.id, u);
    this.usersByEmail.set(u.email, u);
    return u;
  }

  createMembership(input: { tenantId: string; userId: string; role: MembershipRole }) {
    const m: Membership = { id: randomUUID(), tenantId: input.tenantId, userId: input.userId, role: input.role, createdAt: new Date() };
    this.memberships.push(m);
    return m;
  }

  findUserByEmail(email: string) {
    const u = this.usersByEmail.get(email) ?? null;
    if (!u) return null;
    const memberships = this.memberships.filter((m) => m.userId === u.id);
    return { ...u, memberships };
  }

  findUserById(id: string) {
    return this.usersById.get(id) ?? null;
  }

  getTenantById(id: string) {
    return this.tenantsById.get(id) ?? null;
  }

  listMembershipsByTenant(tenantId: string) {
    return this.memberships
      .filter((m) => m.tenantId === tenantId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((m) => ({
        ...m,
        user: (() => {
          const u = this.usersById.get(m.userId);
          if (!u) return null;
          return { id: u.id, email: u.email, fullName: u.fullName, isActive: u.isActive };
        })(),
      }));
  }
}

