import GradesTable from "@/components/GradesTable";
// import { columns } from "@/components/GradesTable/columns";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { doc, updateDoc } from "firebase/firestore";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useLoaderData, useRevalidator } from "react-router-dom";
import { Category, Team } from "@/types/Team";
import { cn } from "@/lib/utils";
import TeamReviewCard from "@/components/TeamReviewCard";
import { fs } from "@/firebase";

// Define the form fields type
type FormValues = {
  password: string;
};
const TeamsDashboard = () => {
  // cambiar por default a false
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const form = useForm<FormValues>();
  const { revalidate } = useRevalidator();

  const { teamsData, categoriesInfo, evaluationsInfo, secret } = useLoaderData();

  console.log("teams Data", teamsData);
  console.log("categoriesInfo", categoriesInfo);
  console.log("evaluationsInfo", evaluationsInfo);

  const [columns, setColumns] = useState<ColumnDef<Team>[]>([]);

  const onSubmit: SubmitHandler<FormValues> = (data: { password: string }) => {
    console.log("Form data:", data);
    if (data.password === secret.password) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    // crear estructura de columnas dinamicamente.
    // PRIMERO LA TABLA DE MEJORES EQUIPOS.
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
        accessorKey: `categoryScores.${category.id}`,
      });
    });

    //  aqui al final si se va a tener que recalcular todo de forma dinamica yo creo. ://
    columns.push({
      accessorKey: "finalScore",
      header: "Calificacion final",
      cell: ({ row }) => {
        const finalScore = row.getValue("finalScore") as number;

        // Define color based on the finalScore value
        const scoreColor = cn({
          "text-red-500": finalScore < 50, // Red for 0-49
          "text-orange-500": finalScore >= 50 && finalScore < 70, // Orange for 50-69
          "text-yellow-500": finalScore >= 70 && finalScore < 85, // Yellow for 70-84
          "text-green-500": finalScore >= 85, // Green for 85-100
        });
        return <p className={scoreColor}>{finalScore} {row.original.evaluated === true ? "✅" : null}</p>;
      },
    });

    setColumns(columns);
  }, [categoriesInfo]);

  const handleScoreSubmit = async (teamId: string, newScore: number) => {
    if (!newScore) {
      return { success: false, error: "There has been an error" };
    }

    try {
      const teamDocRef = doc(fs, `teams/${teamId}`);

      const teamObj = teamsData.find(
        (element: Team) => element.uid === teamId
      ) as Team;

      teamObj.categoryScores["qD5BHVUZ5VbheG2arTjJ"] = newScore;

      const values = Object.values(teamObj.categoryScores);
      const sum = values.reduce((acc, value) => acc + value, 0);
      const average = sum / values.length;
      // update final score
      teamObj.finalScore = average * 10;

      await updateDoc(teamDocRef, {
        evaluated: true,
        ...teamObj,
      });

      // traer data nueva!
      revalidate();
      return { success: true };
    } catch (error) {
      console.error("Error updating document: ", error);
      return { success: false, error };
    }
  };

  return (
    <div className="min-h-dvh h-full flex flex-col justify-center p-4">
      <div className="flex flex-col justify-center h-full items-center">
        {isAuthenticated ? (
          //   <HackathonEvaluationTable />
          <div className="space-y-2 flex flex-col ">
            <Button
              onClick={revalidate}
              variant="outline"
              className="self-end gap-2"
            >
              Refresh data
              <span>
                <RefreshCw className="text-gray-800 size-4" />
              </span>
            </Button>
            <div className="space-y-2">
              <GradesTable data={teamsData} columns={columns} />
              <p className="text-xs text-gray-500">
                Calificacion final toma el promedio de los{" "}
                {categoriesInfo.length} rubros y los multiplica por 10.
              </p>
            </div>

            {/* lista de equipos pendientes para revision manual */}
            <div className="mt-4">
              <p className="text-lg font-bold">Pendientes de revisión manual</p>
              <ul className=" grid grid-cols-4 gap-4">
                {teamsData.map((team: Team, index: number) => {
                  if (!team.evaluated) {
                    return (
                      <TeamReviewCard
                        key={index}
                        team={team}
                        onScoreSubmit={(teamId, newScore) => {
                          console.log("sending", teamId, newScore);
                          handleScoreSubmit(teamId, newScore);
                        }}
                      />
                    );
                  }
                })}
              </ul>
            </div>
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
