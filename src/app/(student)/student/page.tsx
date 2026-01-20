import StatusBadge from "@/components/StatusBadge";
import AppButton from "@/components/AppButton";

export default function StudentPage() {
  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">Moji zahtevi</h1>
      
      <div className="mt-4 border p-4 rounded">
        <p>Uverenje o studiranju</p>
        <StatusBadge status="Podnet" />
      </div>
      
      <div className="mt-4">
        <AppButton>Podnesi novi zahtev</AppButton>
      </div>
    </div>
  );
}