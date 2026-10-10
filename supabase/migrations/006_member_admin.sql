-- Member administration: admins can list members and change roles / status.
-- Both functions are admin-only and refuse to act on the caller's own account,
-- so the last admin can never lock themselves out.

create or replace function public.admin_list_members()
returns table (
  id uuid,
  email text,
  first_name text,
  last_name text,
  city text,
  role text,
  status text,
  created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admins only.' using errcode = '42501';
  end if;
  return query
    select p.id, u.email::text, p.first_name, p.last_name, p.city, p.role, p.status, p.created_at
    from public.profiles p
    join auth.users u on u.id = p.id
    order by p.created_at desc;
end;
$$;

create or replace function public.admin_set_member_role(p_user_id uuid, p_role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admins only.' using errcode = '42501';
  end if;
  if p_role not in ('member', 'editor', 'admin') then
    raise exception 'Unknown role.' using errcode = '22023';
  end if;
  if p_user_id = auth.uid() then
    raise exception 'You cannot change your own role.' using errcode = '42501';
  end if;

  update public.profiles set role = p_role where id = p_user_id;
  if not found then
    raise exception 'Member not found.' using errcode = 'P0002';
  end if;
end;
$$;

create or replace function public.admin_set_member_status(p_user_id uuid, p_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admins only.' using errcode = '42501';
  end if;
  if p_status not in ('active', 'deactivated') then
    raise exception 'Unknown status.' using errcode = '22023';
  end if;
  if p_user_id = auth.uid() then
    raise exception 'You cannot deactivate your own account.' using errcode = '42501';
  end if;

  update public.profiles set status = p_status where id = p_user_id;
  if not found then
    raise exception 'Member not found.' using errcode = 'P0002';
  end if;
end;
$$;

revoke all on function public.admin_list_members() from public, anon;
revoke all on function public.admin_set_member_role(uuid, text) from public, anon;
revoke all on function public.admin_set_member_status(uuid, text) from public, anon;
grant execute on function public.admin_list_members() to authenticated;
grant execute on function public.admin_set_member_role(uuid, text) to authenticated;
grant execute on function public.admin_set_member_status(uuid, text) to authenticated;
