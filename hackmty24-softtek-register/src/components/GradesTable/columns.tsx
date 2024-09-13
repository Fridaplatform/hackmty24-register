import Evaluation from "@/types/Evaluation";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";

const calculateOverallGrade = (evaluation: Evaluation): number => {
  const sum = Object.values(evaluation)
    .filter((value): value is number => typeof value === "number")
    .reduce((acc, value) => acc + value, 0);
  return sum / 10;
};

export const columns: ColumnDef<Evaluation>[] = [
  {
    accessorKey: "judgeName",
    header: "Judge Name",
  },
  {
    accessorKey: "criteria1",
    header: "Criteria 1",
  },
  {
    accessorKey: "criteria2",
    header: "Criteria 2",
  },
  {
    accessorKey: "criteria3",
    header: "Criteria 3",
  },
  {
    accessorKey: "criteria4",
    header: "Criteria 4",
  },
  {
    accessorKey: "criteria5",
    header: "Criteria 5",
  },
  {
    accessorKey: "criteria6",
    header: "Criteria 6",
  },
  {
    accessorKey: "criteria7",
    header: "Criteria 7",
  },
  {
    accessorKey: "criteria8",
    header: "Criteria 8",
  },
  {
    accessorKey: "criteria9",
    header: "Criteria 9",
  },
  {
    accessorKey: "criteria10",
    header: "Criteria 10",
  },
  {
    id: "overallGrade",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Overall Grade
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const average = calculateOverallGrade(row.original);
      return average.toFixed(2);
    },
    sortingFn: (rowA, rowB) => {
      const gradeA = calculateOverallGrade(rowA.original);
      const gradeB = calculateOverallGrade(rowB.original);
      return gradeA - gradeB;
    },
  },
];
