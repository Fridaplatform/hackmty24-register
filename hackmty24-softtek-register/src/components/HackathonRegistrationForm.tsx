"use client";
import React, { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoaderData, useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { fs } from "@/firebase";

const HackathonRegistrationForm: React.FC = () => {
  const uid = useLoaderData() as string;

  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState([
    { name: "", email: "", studentId: "", semester: "", major: "" },
  ]);
  const navigate = useNavigate();

  const addMember = () => {
    setMembers([
      ...members,
      { name: "", email: "", studentId: "", semester: "", major: "" },
    ]);
  };

  const removeMember = (index) => {
    const newMembers = members.filter((_, i) => i !== index);
    setMembers(newMembers);
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ teamName, members });
    // Here you would typically send this data to your backend

    try {
      const docRef = await addDoc(collection(fs, "teams"), {
        teamName,
        members,
        teamLeaderId: uid
      });

      const docId = docRef.id;

      console.log(docId);

      navigate(`/registration-confirmed/${docId}`);
    } catch (e) {
      console.error("There has been an error registering your team", e);
    }

    // TODO: generate code
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 pb-4 flex flex-col items-center"
    >
      <Card className="rounded-none w-full">
        <CardHeader>
          <CardTitle>Hackathon Team Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="teamName">Team Name</Label>
              <Input
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
              />
            </div>

            {members.map((member, index) => (
              <Card key={index} className="p-4">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Team Member {index + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={`name-${index}`}>Name</Label>
                    <Input
                      id={`name-${index}`}
                      value={member.name}
                      onChange={(e) =>
                        handleMemberChange(index, "name", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`email-${index}`}>Email</Label>
                    <Input
                      id={`email-${index}`}
                      type="email"
                      value={member.email}
                      onChange={(e) =>
                        handleMemberChange(index, "email", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`studentId-${index}`}>
                      Student ID (Optional)
                    </Label>
                    <Input
                      id={`studentId-${index}`}
                      value={member.studentId}
                      onChange={(e) =>
                        handleMemberChange(index, "studentId", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`semester-${index}`}>Semester</Label>
                    <Input
                      id={`semester-${index}`}
                      value={member.semester}
                      onChange={(e) =>
                        handleMemberChange(index, "semester", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`major-${index}`}>Major</Label>
                    <Input
                      id={`major-${index}`}
                      value={member.major}
                      onChange={(e) =>
                        handleMemberChange(index, "major", e.target.value)
                      }
                      required
                    />
                  </div>
                  {members.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeMember(index)}
                      className="mt-2"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Remove Member
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}

            <Button type="button" onClick={addMember} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Team Member
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        variant="default"
        className="w-fit bg-blue-400"
        size="lg"
      >
        Submit Registration
      </Button>
    </form>
  );
};

export default HackathonRegistrationForm;
