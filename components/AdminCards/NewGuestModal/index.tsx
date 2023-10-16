import { IAdminModal } from "@/app/admin/page";
import projectConfig from "@/config/project";
import axios from "axios";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";

interface IProps {
  setOpenModal: React.Dispatch<React.SetStateAction<string | undefined>>;
  openModal: IAdminModal | undefined;
}

export default function NewGuestModal({ openModal, setOpenModal }: IProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  const handleNewGuest = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await axios.post("/api/guests/new", {
        name: name.trim().toLocaleLowerCase(),
      });

      if (data.acknowledged) {
        setSuccess(
          `${name.toUpperCase()} foi adicionade na lista de convidados.`
        );
        setName("");
      } else {
        if (data.message === "Guest alredy exists") {
          setError("Convidado já registrado.");
        } else {
          setError("Erro interno tente novamente mais tarde.");
        }
      }
    } catch (error: any) {
      setError("Erro interno tente novamente mais tarde.");
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        show={openModal === "NewGuest"}
        onClose={() => setOpenModal(undefined)}
      >
        <Modal.Header>Criar Convidado</Modal.Header>
        <Modal.Body>
          <div className="space-y-2">
            <Label htmlFor="name" value="Nome" />
            <TextInput
              id="name"
              required
              type="text"
              aria-label="Nome do convidado"
              onChange={(event) => {
                setName(event.target.value);
                if (success) setSuccess("");
              }}
              value={name}
            />
            {error && (
              <p className="text-red-400 text-base leading-relaxed">{error}</p>
            )}
            {success && (
              <p className="text-green-400 text-base leading-relaxed">
                {success}
              </p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color={projectConfig.buttonColor}
            onClick={handleNewGuest}
            disabled={!!success || loading}
          >
            {loading ? "Carregando..." : "Salvar"}
          </Button>
          <Button
            color="gray"
            onClick={() => setOpenModal(undefined)}
            disabled={loading}
          >
            {success ? "Voltar" : "Cancelar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
