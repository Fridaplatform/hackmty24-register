import HackathonEvaluationTable from "@/components/GradesTable";
import GradesTable from "@/components/GradesTable";
// import { columns } from "@/components/GradesTable/columns";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Evaluation from "@/types/Evaluation";
import { ColumnDef } from "@tanstack/react-table";
import { collection, getDocs } from "firebase/firestore";
import { ArrowUpDown, RefreshCw } from "lucide-react";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { fs } from "@/firebase";
import { useLoaderData, useRevalidator } from "react-router-dom";
import { Category, Team } from "@/types/Team";

// Define the form fields type
type FormValues = {
  password: string;
};
const TeamsDashboard = () => {
  // cambiar por default a false
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const form = useForm<FormValues>();
  const { revalidate } = useRevalidator();

  const { teamsData, categoriesInfo, evaluationsInfo } = useLoaderData();

  console.log("teams Data", teamsData);
  console.log("categoriesInfo", categoriesInfo);
  console.log("evaluationsInfo", evaluationsInfo);

  const [columns, setColumns] = useState<ColumnDef<Team>[]>([]);

  const onSubmit: SubmitHandler<FormValues> = (data: { password: string }) => {
    console.log("Form data:", data);
    if (data.password === "softtek#hack24") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    // crear estructura de columnas dinamicamente.
    // PRIMERO LA TABLA DE MEJORES EQUIPOS.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columns: ColumnDef<Team>[] = [];

    columns.push({
      accessorKey: "teamName",
      header: "Equipo",
    });

    columns.push({
      accessorKey: "evaluatorCount",
      header: "No. Evaluaciones",
    });

    // just add the columns for the category scores
    categoriesInfo.map((category: Category) => {
      columns.push({
        header: category.name,
        // cell: ({ row }) => row.original[category.id],
        accessorKey: `categoryScores.${category.id}`,
      });
    });

    columns.push({
      accessorKey: "finalScore",
      header: "Calificacion",
    });

    setColumns(columns);
  }, [categoriesInfo]);

  return (
    <div className="min-h-dvh h-full flex flex-col justify-center">
      <div className="flex flex-col justify-center h-full items-center">
        {isAuthenticated ? (
          //   <HackathonEvaluationTable />
          <div className="space-y-2 flex flex-col ">
            <Button onClick={revalidate} variant="outline" className="self-end gap-2">
              Refresh data
              <span>
              <RefreshCw className="text-gray-800 size-4" />
              </span>
            </Button>
            <GradesTable data={teamsData} columns={columns} />
          </div>
        ) : (
          // <p>auth</p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="max-w-md w-full self-center"
            >
              <FormField
                control={form.control}
                name="password"
                label="Contraseña"
                render={({ field }) => (
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  />
                )}
              />
              <Button type="submit" className="mt-4">
                Ingresar
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default TeamsDashboard;
