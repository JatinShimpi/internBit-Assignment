import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Button,
  Form,
  Input,
  Card,
  Space,
  message,
} from "antd";
import {
  LogoutOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { supabase } from "./supabase";

const { Header, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const Notes = () => {
  const [notes, setNotes] = useState([]);
//   const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      message.error("Failed to load notes",error);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (values) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("notes")
        .insert([
          {
            title: values.title,
            content: values.content,
            user_id: user.id,
          },
        ])
        .select();

      if (error) throw error;

      setNotes([data[0], ...notes]);
      form.resetFields();
    //   setNewNote({ title: "", content: "" });
    } catch (error) {
      message.error("Error creating note",error);
    }
  };

  const updateNote = async (id, updatedNote) => {
    try {
      const { error } = await supabase
        .from("notes")
        .update(updatedNote)
        .eq("id", id);

      if (error) throw error;

      setNotes(
        notes.map((note) =>
          note.id === id ? { ...note, ...updatedNote } : note
        )
      );
      setEditingId(null);
      form.resetFields();
    //   setNewNote({ title: "", content: "" });
    } catch (error) {
      message.error("Error updating note",error);
    }
  };

  const deleteNote = async (id) => {
    try {
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (error) throw error;

      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      message.error("Error deleting note",error);
    }
  };

  const startEditing = (note) => {
    setEditingId(note.id);
    // setNewNote({ title: note.title, content: note.content });
    form.setFieldsValue({ title: note.title, content: note.content });
  };

  const cancelEditing = () => {
    setEditingId(null);
    form.resetFields();
    // setNewNote({ title: "", content: "" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/", { replace: true }); // refresh effect
  };

  return (
    <Layout style={{ minHeight: "100vh", padding: 24 }}>
      <Header style={{ background: "transparent", paddingBottom: 24 }}>
        <div className="flex justify-between items-center">
          <Title level={2} style={{ color: "white", margin: 0 }}>
            My Notes
          </Title>
          <Button
            icon={<LogoutOutlined />}
            type="primary"
            danger
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </Header>

      <Content>
        <Card
          title={editingId ? "Edit Note" : "Create New Note"}
          style={{ marginBottom: 24 }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={(values) =>
              editingId ? updateNote(editingId, values) : createNote(values)
            }
          >
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please enter a title" }]}
            >
              <Input placeholder="Note title" />
            </Form.Item>

            <Form.Item
              name="content"
              label="Content"
              rules={[{ required: true, message: "Please enter some content" }]}
            >
              <Input.TextArea rows={4} placeholder="Note content..." />
            </Form.Item>

            <Form.Item className="flex justify-end space-x-2">
              {editingId && (
                <Button onClick={cancelEditing} style={{ marginRight: 8 }}>
                  Cancel
                </Button>
              )}
              <Button type="primary" htmlType="submit">
                {editingId ? "Update Note" : "Add Note"}
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {loading ? (
          <Text type="secondary">Loading notes...</Text>
        ) : notes.length === 0 ? (
          <Text type="secondary">
            No notes found. Add a note to get started!
          </Text>
        ) : (
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            {notes.map((note) => (
              <Card
                key={note.id}
                title={note.title}
                extra={
                  <Space>
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => startEditing(note)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => deleteNote(note.id)}
                    >
                      Delete
                    </Button>
                  </Space>
                }
              >
                <Paragraph>{note.content}</Paragraph>
                <Text type="secondary">
                  {new Date(note.created_at).toLocaleString()}
                </Text>
              </Card>
            ))}
          </Space>
        )}
      </Content>
    </Layout>
  );
};

export default Notes;
