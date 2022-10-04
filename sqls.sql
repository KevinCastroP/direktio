-- --------------------------
-- users
-- --------------------------
CREATE TABLE public.users (
	id integer NOT null,
	name varchar(120) not null,
	lastname varchar(120) not null,
	phone varchar(30) not null,
	status BOOLEAN default true
);

alter table public.users add constraint pk_users primary key (id);



-- --------------------------
-- skills
-- --------------------------
create table skills (
	id integer NOT null,
	name varchar(120) not null,
	description varchar(120) not null,
	status BOOLEAN default true,
	user_id integer NOT null
);

alter table public.skills add constraint pk_skills primary key (id);

alter table public.skills add constraint fk01_skills_users foreign key (user_id) references public.users(id);


-- --------------------------
-- levels
-- --------------------------
create table levels (
	id integer NOT null,
	type varchar(120) NOT null,
	status BOOLEAN default true
);

alter table public.levels add constraint pk_levels primary key (id);




-- --------------------------
-- level skills
-- --------------------------
create table skills_level (
	id integer NOT null,
	skill_id integer NOT null,
	level_id integer NOT null
);

alter table public.skills_level add constraint pk_skills_level primary key (id);

alter table public.skills_level add constraint fk01_skill foreign key (skill_id) references public.skills(id);

alter table public.skills_level add constraint fk02_level foreign key (level_id) references public.levels(id);



insert into public.users (id, name, lastname, phone) values (1, 'Jon', 'Doe', '+57666');
insert into public.users (id, name, lastname, phone) values (2, 'Juan', 'Talamera', '+57999');


INSERT INTO public.levels (id, "type", status) VALUES(1, 'Bajo', true);
INSERT INTO public.levels (id, "type", status) VALUES(2, 'Intermedio', true);
INSERT INTO public.levels (id, "type", status) VALUES(3, 'Alto', true);


INSERT INTO public.skills (id,"name",description,user_id) VALUES (1,'HTML','Lenguaje de marcado',1);
INSERT INTO public.skills (id,"name",description,user_id) VALUES (2,'JS','Lenguaje de debil tipado',2);

INSERT INTO public.skills_level (id, skill_id, level_id) VALUES(1, 1, 3);
INSERT INTO public.skills_level (id, skill_id, level_id) VALUES(2, 2, 2);


-- --------------------------
-- view
-- --------------------------
create or replace view users_skills 
as
select concat(u.name, ' ', u.lastname) as fullname, h."name" as skill, h.description skill_descripcion, n."type" 
from users u 
inner join skills h on
	u.id = h.user_id 
inner join skills_level hn on
	h.id = hn.skill_id 
inner join levels n on
	hn.level_id = n.id;

-- --------------------------
-- trigger
-- --------------------------
CREATE FUNCTION inactive_user() RETURNS trigger AS $inactive_user$
    BEGIN
        NEW.status := 0;
        RETURN NEW;
    END;
$inactive_user$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER trg_bu_user BEFORE UPDATE
    ON public.users
    FOR each row
    execute procedure public.inactive_user();
