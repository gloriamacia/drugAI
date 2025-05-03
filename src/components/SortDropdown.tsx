import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";

const OPTIONS = ["Most citations", "Most likes", "Newest publication"] as const;

type Props = {
  sortOption: string; // ← plain string
  setSortOption: (v: string) => void; // ← plain string
  variant?: "pill" | "box";
  className?: string;
};

export default function SortDropdown({
  sortOption,
  setSortOption,
  variant = "pill",
  className = "",
}: Props) {
  const baseBtn =
    variant === "pill"
      ? "flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
      : "flex items-center gap-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50";

  return (
    <Menu as="div" className={`relative inline-block ${className}`}>
      <Menu.Button className={baseBtn}>
        <i className="fa-solid fa-sort text-gray-500" />
        <span>{sortOption}</span>
        <ChevronDownIcon className="size-4 text-gray-400" aria-hidden />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Menu.Items className="absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
          {OPTIONS.map((opt) => (
            <Menu.Item key={opt}>
              {({ active }) => (
                <button
                  onClick={() => setSortOption(opt)}
                  className={`block w-full px-4 py-2 text-left text-sm ${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  }`}
                >
                  {opt}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
