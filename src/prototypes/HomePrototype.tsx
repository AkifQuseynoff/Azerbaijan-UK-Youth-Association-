import Picker from "./Picker";
import Alov from "./variants/Alov";
import Hali from "./variants/Hali";
import Kaspi from "./variants/Kaspi";

const variants = [
  { name: "Halı", render: () => <Hali /> },
  { name: "Kaspi", render: () => <Kaspi /> },
  { name: "Alov", render: () => <Alov /> },
];

export default function HomePrototype() {
  return <Picker names={variants.map((v) => v.name)} render={(i) => variants[i].render()} />;
}
