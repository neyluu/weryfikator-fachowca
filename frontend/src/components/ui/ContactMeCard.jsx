import Input from "./Input.jsx";
import Button from "./Button.jsx";

export default function ContactMeCard() {
  return (
    <div className="border-neutral-700 border rounded-3xl p-6">
      <p className="mb-3">Skontaktuj się ze mną!</p>

      <form action="" className="flex gap-3">
        <Input placeholder="Wiadomość" />
        <Button type="submit" className="shrink-0">
          Wyślij wiadomość
        </Button>
      </form>
    </div>
  );
}
