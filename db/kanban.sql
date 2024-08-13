CREATE TABLE IF NOT EXISTS users(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar varchar(300) DEFAULT 'https://cdn.pixabay.com/photo/2017/01/10/03/54/avatar-1968236_1280.png',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS boards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    creator_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS board_users (
    board_id UUID REFERENCES boards(id),
    user_id UUID REFERENCES users(id),
    role VARCHAR(50) CHECK (role IN ('admin', 'moderator', 'member')),
    PRIMARY KEY (board_id, user_id)
);

CREATE TABLE IF NOT EXISTS columns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    board_id UUID REFERENCES boards(id),
    order_column INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) CHECK (
        status IN (
            'todo',
            'in_progress',
            'done',
            'completed',
            'stuck'
        )
    ),
    DATE VARCHAR(20) CHECK (
        DATE IN (
            'today',
            'tomorrow',
            'overdue',
            'thisweek',
            'nextweek',
            'future'
        )
    ),
    duedate DATE DEFAULT NULL,
    priority VARCHAR(50) CHECK (priority IN ('normal', 'high', 'medium', 'low')),
    column_id UUID REFERENCES columns(id),
    creator_id UUID REFERENCES users(id),
    board_id UUID REFERENCES boards(id),
    assignee_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    user_id UUID REFERENCES users(id),
    task_id UUID REFERENCES tasks(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attachments(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL,
    task_id UUID REFERENCES tasks(id) NOT NULL
);