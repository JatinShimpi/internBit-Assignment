import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Form, Input, Button, Typography, message, Card } from "antd";
import { supabase } from "./supabase.js";
import { loginUser } from "./Auth.js";

const { Title, Text, Link } = Typography;

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    const result = await loginUser(values.email, values.password);
    setLoading(false);

    if (result.success) {
      message.success("Login successful!");
      navigate("/notes");
    } else {
      message.error(result.message);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        navigate("/notes");
      }
    };

    checkUser();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-[#141414] px-4">
      <Card
        title={
          <Title level={3} className="text-white">
            Sign In
          </Title>
        }
        bordered={false}
        style={{ width: 400, backgroundColor: "#1f1f1f" }}
      >
        <Form
          layout="vertical"
          onFinish={handleLogin}
          initialValues={{ email: "", password: "" }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input placeholder="you@example.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Login
            </Button>
          </Form.Item>

          <Text type="secondary">
            Not registered?{" "}
            <Link href="/signup" style={{ marginLeft: 4 }}>
              Sign Up
            </Link>
          </Text>
        </Form>
      </Card>
    </div>
  );
};

export default SignIn;
