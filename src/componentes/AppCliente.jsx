import { Table, Row, Col, Modal, Form, Input, Button, Flex, Popconfirm } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";


function AppCliente() {
  const [data, setData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [isUpdate, setIsUpdate] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
    setIsUpdate(false);
  };

  const showModalEdit = async (id) => {
    console.log(id);
    setIsModalOpen(true);
    setIsUpdate(true);
    let response = await axios.get(`http://localhost:3000/clientes/${id}`);
    form.setFieldsValue(response.data);
    console.log(response.data , 'soy response de data')
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const confirm = async (id) => {
    await axios.delete(`http://localhost:3000/clientes/${id}`)
    getData();
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Apellido",
      dataIndex: "apellido",
      key: "apellido",
    },
    {
      title: "address",
      dataIndex: "address",
      key: "address",
    },

    {
      title: "Estatus",
      dataIndex: "estatus",
      key: "estatus",
      render: (text) => {
        return text ? "active" : "Inactive";
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text) => {
        return text ? "active" : "Inactive";
      },
    },
    {
      title: "Fecha",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) =>  {
        return (text.slice(0, 10))
      },
    },

    {
      title: "Actions",
      dataIndex: "actions ",
      key: "actions",
      render: (value, Row) => {
        return (
          <>
            <Button
              type="default"
              onClick={() => showModalEdit(Row.id)}
              style={{ marginRight: "4px" }}
            >
              {" "}
              Editar{" "}
            </Button>

            <Popconfirm
              title="Delete the user"
              description="Are you sure to delete this task?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => confirm(Row.id)}
            > 
            <Button danger>Delete</Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const getData = async () => {
    let response = await axios.get("http://localhost:3000/clientes");
    setData(response.data);
  };

  useEffect(() => {
    getData();
  }, []);

  const onFinish = async (values) => {
    const idCliente = values.id;
    const { id, ...data } = values;
    if (isUpdate) {
      const response = await axios.put(
        `http://localhost:3000/clientes/${idCliente}`,
        data
      );
    } else {
      const response = await axios.post(
        `http://localhost:3000/clientes`,
        values
      );
    }
    getData();
    form.resetFields();
    handleCancel();
    console.log("Received values of form: ", values);
  };
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Nuevo Usuario
      </Button>

      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={""}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            name="nombre"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="apellido"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input type="text" placeholder="Apellido" />
          </Form.Item>

          <Form.Item
            name="contrasenia"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input type="password" placeholder="Password" />
          </Form.Item>

          <Form.Item name="id" hidden>
            <Input type="text" />
          </Form.Item>

          <Form.Item>
            {isUpdate ? (
              <Button block type="primary" htmlType="submit">
                Update
              </Button>
            ) : (
              <Button block type="primary" htmlType="submit">
                Create
              </Button>
            )}
          </Form.Item>
        </Form>
      </Modal>

      <Row>
        <Col md={24} style={{ display: "flex", justifyContent: "center" }}>
          <Table rowKey={"id"} dataSource={data} columns={columns} />
        </Col>
      </Row>
    </>
  );
}

export default AppCliente;
