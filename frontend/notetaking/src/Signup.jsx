import React, { useEffect, useState } from "react";
import { Form, Input, Button, Typography, Alert, Card } from "antd";
import { useNavigate } from "react-router";
import { signupUser } from "./Auth";
import { supabase } from "./supabase";

const { Title } = Typography;

const Signup = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const onFinish = async (values) => {
    setLoading(true);
    const { email, password } = values;
    const result = await signupUser(email, password);

    if (result.success) {
      navigate("/");
    } else {
      setErrorMsg(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#141414] px-4">
      <Card
        title={
          <Title level={3} className="text-white">
            Sign Up
          </Title>
        }
        bordered={false}
        style={{ width: 400, backgroundColor: "#1f1f1f" }}
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          requiredMark={false}
        >
          <Form.Item
            label={<span className="text-white">Email</span>}
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Invalid email address!" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            label={<span className="text-white">Password</span>}
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          {errorMsg && (
            <Alert message={errorMsg} type="error" showIcon className="mb-4" />
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="bg-blue-600 hover:bg-blue-700"
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Signup;
