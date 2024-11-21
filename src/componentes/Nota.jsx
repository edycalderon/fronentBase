import {
  Table,
  Row,
  Col,
  Modal,
  Form,
  Input,
  Button,
  Flex,
  Popconfirm,
  Select,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

function Nota() {
  const [data, setData] = useState([]);
  const [dataUsuario, setDataUsuario] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [isUpdate, setIsUpdate] = useState(false);

  const nameUser = dataUsuario.map((item) => item.nombre);
  console.log(nameUser, "soy nameUser");

  const idUser = data.map((item) => item.User.id);

  const [selectedItems, setSelectedItems] = useState([]);
  const filteredOptions = nameUser.filter((o) => !selectedItems.includes(o));

  const showModal = () => {
    setIsModalOpen(true);
    setIsUpdate(false);
  };

  const showID = async (id) => {
    try {
      console.log(id, 'soy id')
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const showModalUsuarioEdit = async () => {
    try {
      let responseU = await axios.get(`http://localhost:3000/usuarios`);
      form.setFieldValue(responseU.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const showModalEdit = async (id) => {
    try {
      console.log(id);
      setIsModalOpen(true);
      setIsUpdate(true);
      let response = await axios.get(`http://localhost:3000/notas/${id}`);
      const usuarioResponse = await axios.get(`http://localhost:3000/usuarios/${id}`);

      form.setFieldsValue(response.data);
      showModalUsuarioEdit();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const confirm = async (id) => {
    await axios.delete(`http://localhost:3000/notas/${id}`);
    getData();
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Nota",
      dataIndex: "nota",
      key: "nota",
    },
    {
      title: "Usuario",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "UserID",
      dataIndex: "userId",
      key: "userId",
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
    let response = await axios.get("http://localhost:3000/notas");
    let responseU = await axios.get(`http://localhost:3000/usuarios`);
    setData(response.data);
    setDataUsuario(responseU.data);
  };

  useEffect(() => {
    getData();
  }, []);

  const onFinish = async (values) => {
    console.log(values, 'soy value')
    const idNotas = values.id;
    console.log(idNotas, 'soy idNotas')
    const { id, ...data } = values;
    if (isUpdate) {
      const response = await axios.put(
        `http://localhost:3000/notas/${idNotas}`,
        data
      );
    } else {
      const response = await axios.post(`http://localhost:3000/notas${id}`, values );
      const responseU = await axios.post(`http://localhost:3000/notas${id}`, values );
    }
    getData();
    form.resetFields();
    handleCancel();
    console.log("Received values of form: ", values);
  };
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Agregar Nota
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
            name="nota"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input placeholder="Nota" />
          </Form.Item>

          <Select
            defaultValue="1"
            style={{
              width: "100%",
            }}
            options={filteredOptions.map((item) => ({
              value: item,
              label: item,
            }))}
          />

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

export default Nota;
