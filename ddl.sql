

drop database if exists se211;

create database se211 character set utf8mb4;

use se211;

create table lec_time(
    idx int not null auto_increment,
    name int not null,
    dotw int not null,
    start timestamp not null,
    end timestamp not null,

    primary key(idx)
);

create table lecture(
    idx int not null auto_increment,
    lecname varchar(64) not null,
    lecnum varchar(32),
    profname varchar(64),

    primary key(idx)
);

create table lec_room(
    idx int not null auto_increment,
    building varchar(128),
    classroom varchar(128),

    primary key(idx),
    unique key(building, classroom)
);

create table lec_time_link(
    lecture_idx INT NOT NULL,
    lec_time_idx INT NOT NULL,
    PRIMARY KEY(lecture_idx, lec_time_idx),
    FOREIGN KEY (lecture_idx) REFERENCES lecture(idx),
    FOREIGN KEY (lec_time_idx) REFERENCES lec_time(idx)
);

create table lec_room_link(
    lecture_idx INT NOT NULL,
    lec_room_idx INT NOT NULL,
    PRIMARY KEY(lecture_idx, lec_room_idx),
    FOREIGN KEY (lecture_idx) REFERENCES lecture(idx),
    FOREIGN KEY (lec_room_idx) REFERENCES lec_room(idx)
);

create table reservation(
    idx int not null auto_increment,
    userid varchar(128) not null,
    start timestamp not null,
    end timestamp not null,
    lec_room_idx int not null,
    enable int not null,
    fb_key varchar(256) not null,

    primary key(idx),
    FOREIGN key(lec_room_idx) REFERENCES lec_room(idx)
);



-- 없음
insert into lec_time(name, dotw, start, end) values(0, 0, "2000-01-01 00:00:00", "2000-01-01 00:00:00");

-- 1교시
insert into lec_time(name, dotw, start, end) values(1, 1, "2000-01-01 09:00:00", "2000-01-01 09:50:00");
insert into lec_time(name, dotw, start, end) values(1, 2, "2000-01-01 09:00:00", "2000-01-01 09:50:00");
insert into lec_time(name, dotw, start, end) values(1, 3, "2000-01-01 09:00:00", "2000-01-01 09:50:00");
insert into lec_time(name, dotw, start, end) values(1, 4, "2000-01-01 09:00:00", "2000-01-01 09:50:00");
insert into lec_time(name, dotw, start, end) values(1, 5, "2000-01-01 09:00:00", "2000-01-01 09:50:00");
insert into lec_time(name, dotw, start, end) values(1, 6, "2000-01-01 09:00:00", "2000-01-01 09:50:00");

-- 2교시
insert into lec_time(name, dotw, start, end) values(2, 1, "2000-01-01 10:00:00", "2000-01-01 10:50:00");
insert into lec_time(name, dotw, start, end) values(2, 2, "2000-01-01 10:00:00", "2000-01-01 10:50:00");
insert into lec_time(name, dotw, start, end) values(2, 3, "2000-01-01 10:00:00", "2000-01-01 10:50:00");
insert into lec_time(name, dotw, start, end) values(2, 4, "2000-01-01 10:00:00", "2000-01-01 10:50:00");
insert into lec_time(name, dotw, start, end) values(2, 5, "2000-01-01 10:00:00", "2000-01-01 10:50:00");
insert into lec_time(name, dotw, start, end) values(2, 6, "2000-01-01 10:00:00", "2000-01-01 10:50:00");

-- 3교시
insert into lec_time(name, dotw, start, end) values(3, 1, "2000-01-01 11:00:00", "2000-01-01 11:50:00");
insert into lec_time(name, dotw, start, end) values(3, 2, "2000-01-01 11:00:00", "2000-01-01 11:50:00");
insert into lec_time(name, dotw, start, end) values(3, 3, "2000-01-01 11:00:00", "2000-01-01 11:50:00");
insert into lec_time(name, dotw, start, end) values(3, 4, "2000-01-01 11:00:00", "2000-01-01 11:50:00");
insert into lec_time(name, dotw, start, end) values(3, 5, "2000-01-01 11:00:00", "2000-01-01 11:50:00");
insert into lec_time(name, dotw, start, end) values(3, 6, "2000-01-01 11:00:00", "2000-01-01 11:50:00");

-- 4교시
insert into lec_time(name, dotw, start, end) values(4, 1, "2000-01-01 12:00:00", "2000-01-01 12:50:00");
insert into lec_time(name, dotw, start, end) values(4, 2, "2000-01-01 12:00:00", "2000-01-01 12:50:00");
insert into lec_time(name, dotw, start, end) values(4, 3, "2000-01-01 12:00:00", "2000-01-01 12:50:00");
insert into lec_time(name, dotw, start, end) values(4, 4, "2000-01-01 12:00:00", "2000-01-01 12:50:00");
insert into lec_time(name, dotw, start, end) values(4, 5, "2000-01-01 12:00:00", "2000-01-01 12:50:00");
insert into lec_time(name, dotw, start, end) values(4, 6, "2000-01-01 12:00:00", "2000-01-01 12:50:00");

-- 5교시
insert into lec_time(name, dotw, start, end) values(5, 1, "2000-01-01 13:00:00", "2000-01-01 13:50:00");
insert into lec_time(name, dotw, start, end) values(5, 2, "2000-01-01 13:00:00", "2000-01-01 13:50:00");
insert into lec_time(name, dotw, start, end) values(5, 3, "2000-01-01 13:00:00", "2000-01-01 13:50:00");
insert into lec_time(name, dotw, start, end) values(5, 4, "2000-01-01 13:00:00", "2000-01-01 13:50:00");
insert into lec_time(name, dotw, start, end) values(5, 5, "2000-01-01 13:00:00", "2000-01-01 13:50:00");
insert into lec_time(name, dotw, start, end) values(5, 6, "2000-01-01 13:00:00", "2000-01-01 13:50:00");

-- 6교시
insert into lec_time(name, dotw, start, end) values(6, 1, "2000-01-01 14:00:00", "2000-01-01 14:50:00");
insert into lec_time(name, dotw, start, end) values(6, 2, "2000-01-01 14:00:00", "2000-01-01 14:50:00");
insert into lec_time(name, dotw, start, end) values(6, 3, "2000-01-01 14:00:00", "2000-01-01 14:50:00");
insert into lec_time(name, dotw, start, end) values(6, 4, "2000-01-01 14:00:00", "2000-01-01 14:50:00");
insert into lec_time(name, dotw, start, end) values(6, 5, "2000-01-01 14:00:00", "2000-01-01 14:50:00");
insert into lec_time(name, dotw, start, end) values(6, 6, "2000-01-01 14:00:00", "2000-01-01 14:50:00");

-- 7교시
insert into lec_time(name, dotw, start, end) values(7, 1, "2000-01-01 15:00:00", "2000-01-01 15:50:00");
insert into lec_time(name, dotw, start, end) values(7, 2, "2000-01-01 15:00:00", "2000-01-01 15:50:00");
insert into lec_time(name, dotw, start, end) values(7, 3, "2000-01-01 15:00:00", "2000-01-01 15:50:00");
insert into lec_time(name, dotw, start, end) values(7, 4, "2000-01-01 15:00:00", "2000-01-01 15:50:00");
insert into lec_time(name, dotw, start, end) values(7, 5, "2000-01-01 15:00:00", "2000-01-01 15:50:00");
insert into lec_time(name, dotw, start, end) values(7, 6, "2000-01-01 15:00:00", "2000-01-01 15:50:00");

-- 8교시
insert into lec_time(name, dotw, start, end) values(8, 1, "2000-01-01 16:00:00", "2000-01-01 16:50:00");
insert into lec_time(name, dotw, start, end) values(8, 2, "2000-01-01 16:00:00", "2000-01-01 16:50:00");
insert into lec_time(name, dotw, start, end) values(8, 3, "2000-01-01 16:00:00", "2000-01-01 16:50:00");
insert into lec_time(name, dotw, start, end) values(8, 4, "2000-01-01 16:00:00", "2000-01-01 16:50:00");
insert into lec_time(name, dotw, start, end) values(8, 5, "2000-01-01 16:00:00", "2000-01-01 16:50:00");
insert into lec_time(name, dotw, start, end) values(8, 6, "2000-01-01 16:00:00", "2000-01-01 16:50:00");

-- 9교시
insert into lec_time(name, dotw, start, end) values(9, 1, "2000-01-01 17:30:00", "2000-01-01 18:20:00");
insert into lec_time(name, dotw, start, end) values(9, 2, "2000-01-01 17:30:00", "2000-01-01 18:20:00");
insert into lec_time(name, dotw, start, end) values(9, 3, "2000-01-01 17:30:00", "2000-01-01 18:20:00");
insert into lec_time(name, dotw, start, end) values(9, 4, "2000-01-01 17:30:00", "2000-01-01 18:20:00");
insert into lec_time(name, dotw, start, end) values(9, 5, "2000-01-01 17:30:00", "2000-01-01 18:20:00");
insert into lec_time(name, dotw, start, end) values(9, 6, "2000-01-01 17:30:00", "2000-01-01 18:20:00");

-- 10교시
insert into lec_time(name, dotw, start, end) values(10, 1, "2000-01-01 18:25:00", "2000-01-01 19:15:00");
insert into lec_time(name, dotw, start, end) values(10, 2, "2000-01-01 18:25:00", "2000-01-01 19:15:00");
insert into lec_time(name, dotw, start, end) values(10, 3, "2000-01-01 18:25:00", "2000-01-01 19:15:00");
insert into lec_time(name, dotw, start, end) values(10, 4, "2000-01-01 18:25:00", "2000-01-01 19:15:00");
insert into lec_time(name, dotw, start, end) values(10, 5, "2000-01-01 18:25:00", "2000-01-01 19:15:00");
insert into lec_time(name, dotw, start, end) values(10, 6, "2000-01-01 18:25:00", "2000-01-01 19:15:00");

-- 11교시
insert into lec_time(name, dotw, start, end) values(11, 1, "2000-01-01 19:20:00", "2000-01-01 20:10:00");
insert into lec_time(name, dotw, start, end) values(11, 2, "2000-01-01 19:20:00", "2000-01-01 20:10:00");
insert into lec_time(name, dotw, start, end) values(11, 3, "2000-01-01 19:20:00", "2000-01-01 20:10:00");
insert into lec_time(name, dotw, start, end) values(11, 4, "2000-01-01 19:20:00", "2000-01-01 20:10:00");
insert into lec_time(name, dotw, start, end) values(11, 5, "2000-01-01 19:20:00", "2000-01-01 20:10:00");
insert into lec_time(name, dotw, start, end) values(11, 6, "2000-01-01 19:20:00", "2000-01-01 20:10:00");

-- 12교시
insert into lec_time(name, dotw, start, end) values(12, 1, "2000-01-01 20:15:00", "2000-01-01 21:05:00");
insert into lec_time(name, dotw, start, end) values(12, 2, "2000-01-01 20:15:00", "2000-01-01 21:05:00");
insert into lec_time(name, dotw, start, end) values(12, 3, "2000-01-01 20:15:00", "2000-01-01 21:05:00");
insert into lec_time(name, dotw, start, end) values(12, 4, "2000-01-01 20:15:00", "2000-01-01 21:05:00");
insert into lec_time(name, dotw, start, end) values(12, 5, "2000-01-01 20:15:00", "2000-01-01 21:05:00");
insert into lec_time(name, dotw, start, end) values(12, 6, "2000-01-01 20:15:00", "2000-01-01 21:05:00");

-- 13교시
insert into lec_time(name, dotw, start, end) values(13, 1, "2000-01-01 21:10:00", "2000-01-01 22:00:00");
insert into lec_time(name, dotw, start, end) values(13, 2, "2000-01-01 21:10:00", "2000-01-01 22:00:00");
insert into lec_time(name, dotw, start, end) values(13, 3, "2000-01-01 21:10:00", "2000-01-01 22:00:00");
insert into lec_time(name, dotw, start, end) values(13, 4, "2000-01-01 21:10:00", "2000-01-01 22:00:00");
insert into lec_time(name, dotw, start, end) values(13, 5, "2000-01-01 21:10:00", "2000-01-01 22:00:00");
insert into lec_time(name, dotw, start, end) values(13, 6, "2000-01-01 21:10:00", "2000-01-01 22:00:00");

-- 14교시
insert into lec_time(name, dotw, start, end) values(14, 1, "2000-01-01 22:05:00", "2000-01-01 22:55:00");
insert into lec_time(name, dotw, start, end) values(14, 2, "2000-01-01 22:05:00", "2000-01-01 22:55:00");
insert into lec_time(name, dotw, start, end) values(14, 3, "2000-01-01 22:05:00", "2000-01-01 22:55:00");
insert into lec_time(name, dotw, start, end) values(14, 4, "2000-01-01 22:05:00", "2000-01-01 22:55:00");
insert into lec_time(name, dotw, start, end) values(14, 5, "2000-01-01 22:05:00", "2000-01-01 22:55:00");
insert into lec_time(name, dotw, start, end) values(14, 6, "2000-01-01 22:05:00", "2000-01-01 22:55:00");

-- A교시
insert into lec_time(name, dotw, start, end) values(21, 1, "2000-01-01 09:30:00", "2000-01-01 10:45:00");
insert into lec_time(name, dotw, start, end) values(21, 2, "2000-01-01 09:30:00", "2000-01-01 10:45:00");
insert into lec_time(name, dotw, start, end) values(21, 3, "2000-01-01 09:30:00", "2000-01-01 10:45:00");
insert into lec_time(name, dotw, start, end) values(21, 4, "2000-01-01 09:30:00", "2000-01-01 10:45:00");
insert into lec_time(name, dotw, start, end) values(21, 5, "2000-01-01 09:30:00", "2000-01-01 10:45:00");
insert into lec_time(name, dotw, start, end) values(21, 6, "2000-01-01 09:30:00", "2000-01-01 10:45:00");

-- B교시
insert into lec_time(name, dotw, start, end) values(22, 1, "2000-01-01 11:00:00", "2000-01-01 12:15:00");
insert into lec_time(name, dotw, start, end) values(22, 2, "2000-01-01 11:00:00", "2000-01-01 12:15:00");
insert into lec_time(name, dotw, start, end) values(22, 3, "2000-01-01 11:00:00", "2000-01-01 12:15:00");
insert into lec_time(name, dotw, start, end) values(22, 4, "2000-01-01 11:00:00", "2000-01-01 12:15:00");
insert into lec_time(name, dotw, start, end) values(22, 5, "2000-01-01 11:00:00", "2000-01-01 12:15:00");
insert into lec_time(name, dotw, start, end) values(22, 6, "2000-01-01 11:00:00", "2000-01-01 12:15:00");

-- C교시
insert into lec_time(name, dotw, start, end) values(23, 1, "2000-01-01 13:00:00", "2000-01-01 14:15:00");
insert into lec_time(name, dotw, start, end) values(23, 2, "2000-01-01 13:00:00", "2000-01-01 14:15:00");
insert into lec_time(name, dotw, start, end) values(23, 3, "2000-01-01 13:00:00", "2000-01-01 14:15:00");
insert into lec_time(name, dotw, start, end) values(23, 4, "2000-01-01 13:00:00", "2000-01-01 14:15:00");
insert into lec_time(name, dotw, start, end) values(23, 5, "2000-01-01 13:00:00", "2000-01-01 14:15:00");
insert into lec_time(name, dotw, start, end) values(23, 6, "2000-01-01 13:00:00", "2000-01-01 14:15:00");

-- D교시
insert into lec_time(name, dotw, start, end) values(24, 1, "2000-01-01 14:30:00", "2000-01-01 15:45:00");
insert into lec_time(name, dotw, start, end) values(24, 2, "2000-01-01 14:30:00", "2000-01-01 15:45:00");
insert into lec_time(name, dotw, start, end) values(24, 3, "2000-01-01 14:30:00", "2000-01-01 15:45:00");
insert into lec_time(name, dotw, start, end) values(24, 4, "2000-01-01 14:30:00", "2000-01-01 15:45:00");
insert into lec_time(name, dotw, start, end) values(24, 5, "2000-01-01 14:30:00", "2000-01-01 15:45:00");
insert into lec_time(name, dotw, start, end) values(24, 6, "2000-01-01 14:30:00", "2000-01-01 15:45:00");

-- E교시
insert into lec_time(name, dotw, start, end) values(25, 1, "2000-01-01 16:00:00", "2000-01-01 17:15:00");
insert into lec_time(name, dotw, start, end) values(25, 2, "2000-01-01 16:00:00", "2000-01-01 17:15:00");
insert into lec_time(name, dotw, start, end) values(25, 3, "2000-01-01 16:00:00", "2000-01-01 17:15:00");
insert into lec_time(name, dotw, start, end) values(25, 4, "2000-01-01 16:00:00", "2000-01-01 17:15:00");
insert into lec_time(name, dotw, start, end) values(25, 5, "2000-01-01 16:00:00", "2000-01-01 17:15:00");
insert into lec_time(name, dotw, start, end) values(25, 6, "2000-01-01 16:00:00", "2000-01-01 17:15:00");



show tables;

desc lec_time;
desc lecture;
desc lec_room;
desc lec_time_link;
desc lec_room_link;
desc reservation;
