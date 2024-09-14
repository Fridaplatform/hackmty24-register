import { Form, SubmitHandler, useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { FormField } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Team } from "@/types/Team";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface Props {
  team: Team;
  onScoreSubmit: (teamId: string, newScore: number) => void;
}

export const TeamReviewCard: React.FC<Props> = ({ team, onScoreSubmit }) => {
  const [newScore, setNewScore] = useState("");

  return (
    <Card className="mb-4 w-full max-w-md ">
      <CardHeader>
        <CardTitle>{team.teamName}, {team.uid}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
          <Input
            value={newScore}
            onChange={(e) => setNewScore(e.target.value)}
            type="number"
            min={0}
            max={10}
            step={0.5}
            required
          />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button>Calificar</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Ya tiene calificación</AlertDialogTitle>
              <AlertDialogDescription>
                Estas seguro de que quieres calificar al equipo {team.teamName}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onScoreSubmit(team.uid, parseFloat(newScore))}
              >
                Continuar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default TeamReviewCard;
