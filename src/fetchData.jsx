import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { experienceFinder } from "../utils/experiencefinder";
import { useTheme } from "./context/ThemeContext";
import API_BASE_URL from "./config";

// Confirmation Dialog Component for Mark as Solved
const SolveConfirmationDialog = ({ isOpen, onClose, onConfirm }) => {
  const { currentTheme } = useTheme();
  const [step, setStep] = useState(1);
  const [xpDeduction, setXpDeduction] = useState(0);
  const [learningNotes, setLearningNotes] = useState("");
  
  const handleFirstQuestion = (answer) => {
    if (answer) {
      onConfirm(0);
    } else {
      setStep(2);
    }
  };
  
  const handleSecondQuestion = (answer) => {
    if (answer) {
      setXpDeduction(40);
      onConfirm(40);
    } else {
      setStep(3);
    }
  };
  
  const handleThirdQuestion = (answer) => {
    if (answer) {
      setStep(4);
    } else {
      setXpDeduction(60);
      onConfirm(60);
    }
  };
  
  const handleSubmitLearning = () => {
    if (learningNotes.trim().length < 10) {
      toast.error(": Please provide a meaningful description of what you learned");
      return;
    }
    setXpDeduction(60);
    onConfirm(60, learningNotes);
  };
  
  const resetState = () => {
    setStep(1);
    setXpDeduction(0);
    setLearningNotes("");
  };
  
  useEffect(() => {
    if (isOpen) {
      resetState();
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="max-w-md mx-auto p-6 relative"
        style={{ 
          backgroundColor: currentTheme.cardBgColor,
          borderRadius: currentTheme.borderRadius,
          border: `1px solid ${currentTheme.borderColor}`,
          boxShadow: currentTheme.boxShadow,
          color: currentTheme.textColor,
          fontFamily: currentTheme.fontFamily
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-transparent border-none p-1"
          style={{ color: currentTheme.primaryColor }}
        >
          x
        </button>
        
        <h2 className="text-lg font-bold mb-4 text-center pb-2" style={{ 
          color: currentTheme.primaryColor,
          borderBottom: `1px solid ${currentTheme.borderColor}`
        }}>
          $ problem_verification.sh
        </h2>
        
        <div className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <p style={{ color: currentTheme.textColor }}> "Did you give 100% effort and solve this problem completely by yourself?"</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleFirstQuestion(true)}
                  className="px-4 py-2"
                  style={{ 
                    backgroundColor: currentTheme.highlightColor,
                    color: currentTheme.primaryColor,
                    border: `1px solid ${currentTheme.borderColor}`,
                    borderRadius: currentTheme.borderRadius
                  }}
                >
                 Yes ✅
                </button>
                <button
                  onClick={() => handleFirstQuestion(false)}
                  className="px-4 py-2"
                  style={{ 
                    backgroundColor: currentTheme.highlightColor,
                    color: "#ff6b6b", // Keep red for "No" regardless of theme
                    border: `1px solid ${currentTheme.borderColor}`,
                    borderRadius: currentTheme.borderRadius
                  }}
                >
                   No ❌
                </button>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-4">
              <p style={{ color: currentTheme.textColor }}>"Did you try your best to implement it and successfully get it working?"</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleSecondQuestion(true)}
                  className="px-4 py-2"
                  style={{ 
                    backgroundColor: currentTheme.highlightColor,
                    color: currentTheme.primaryColor,
                    border: `1px solid ${currentTheme.borderColor}`,
                    borderRadius: currentTheme.borderRadius
                  }}
                >
                   Yes ✅
                </button>
                <button
                  onClick={() => handleSecondQuestion(false)}
                  className="px-4 py-2"
                  style={{ 
                    backgroundColor: currentTheme.highlightColor,
                    color: "#ff6b6b", // Keep red for "No" regardless of theme
                    border: `1px solid ${currentTheme.borderColor}`,
                    borderRadius: currentTheme.borderRadius
                  }}
                >
                   No ❌
                </button>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-4">
              <p style={{ color: currentTheme.textColor }}>"Did you check the editorial (if available)?"</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleThirdQuestion(true)}
                  className="px-4 py-2"
                  style={{ 
                    backgroundColor: currentTheme.highlightColor,
                    color: currentTheme.primaryColor,
                    border: `1px solid ${currentTheme.borderColor}`,
                    borderRadius: currentTheme.borderRadius
                  }}
                >
                   Yes ✅
                </button>
                <button
                  onClick={() => handleThirdQuestion(false)}
                  className="px-4 py-2"
                  style={{ 
                    backgroundColor: currentTheme.highlightColor,
                    color: "#ff6b6b", // Keep red for "No" regardless of theme
                    border: `1px solid ${currentTheme.borderColor}`,
                    borderRadius: currentTheme.borderRadius
                  }}
                >
                   No ❌
                </button>
              </div>
            </div>
          )}
          
          {step === 4 && (
            <div className="space-y-4">
              <p style={{ color: currentTheme.textColor }}> "What idea or proof did you learn from it?"</p>
              <textarea
                value={learningNotes}
                onChange={(e) => setLearningNotes(e.target.value)}
                className="w-full p-2 min-h-[100px] focus:outline-none"
                placeholder="Type your learnings here... (at least 10 characters)"
                style={{ 
                  backgroundColor: currentTheme.backgroundColor,
                  color: currentTheme.textColor,
                  border: `1px solid ${currentTheme.borderColor}`,
                  borderRadius: currentTheme.borderRadius,
                  fontFamily: currentTheme.fontFamily
                }}
              />
              <div className="flex justify-center">
                <button
                  onClick={handleSubmitLearning}
                  className="px-4 py-2"
                  disabled={learningNotes.trim().length < 10}
                  style={{ 
                    backgroundColor: currentTheme.highlightColor,
                    color: currentTheme.primaryColor,
                    border: `1px solid ${currentTheme.borderColor}`,
                    borderRadius: currentTheme.borderRadius,
                    opacity: learningNotes.trim().length < 10 ? 0.5 : 1
                  }}
                >
                  Submit Learning
                </button>
              </div>
            </div>
          )}
          
          {xpDeduction > 0 && (
            <div className="text-center text-sm" style={{ color: currentTheme.accentColor }}>
               "Note: {xpDeduction}% XP deduction will be applied"
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Dialog Component for Theme CP
const ThemeCpDialog = ({ isOpen, onClose, handle, onFormSubmit }) => {
  const { currentTheme } = useTheme();
  const [level, setLevel] = useState("");
  const [solvedCount, setSolvedCount] = useState(1);
  const [problems, setProblems] = useState([]);
  const [formUpdated, setFormUpdated] = useState(false);

  const handleSubmit = () => {
    if (!level || problems.some(p => !p.contestId || !p.problemIndex)) return;
    
    setFormUpdated(true);
    onFormSubmit({
      handle,
      level,
      solvedCount,
      problems
    });
    
    setTimeout(() => onClose(), 1500);
  };

  const handleSolvedChange = (value) => {
    setSolvedCount(value);
    setProblems(Array(4 - value).fill({ contestId: "", problemIndex: "" }));
  };

  const handleProblemChange = (index, field, value) => {
    setProblems(prev => {
      const newProblems = [...prev];
      newProblems[index] = { ...newProblems[index], [field]: value };
      return newProblems;
    });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="max-w-md mx-auto p-6 relative"
        style={{ 
          backgroundColor: currentTheme.cardBgColor,
          borderRadius: currentTheme.borderRadius,
          border: `1px solid ${currentTheme.borderColor}`,
          boxShadow: currentTheme.boxShadow,
          color: currentTheme.textColor,
          fontFamily: currentTheme.fontFamily
        }}
      >
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 bg-transparent border-none p-1"
          style={{ color: currentTheme.primaryColor }}
        >
          x
        </button>
        
        <h2 className="text-lg font-bold mb-4 text-center pb-2" style={{ 
          color: currentTheme.primaryColor,
          borderBottom: `1px solid ${currentTheme.borderColor}`
        }}>
        Add a Problem
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1" style={{ color: currentTheme.textColor }}> "Enter level:"</label>
            <input
              type="text"
              placeholder="Which level?"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full p-2 focus:outline-none"
              style={{ 
                backgroundColor: currentTheme.backgroundColor,
                color: currentTheme.textColor,
                border: `1px solid ${currentTheme.borderColor}`,
                borderRadius: currentTheme.borderRadius,
                fontFamily: currentTheme.fontFamily
              }}
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1" style={{ color: currentTheme.textColor }}> "Problems solved:"</label>
            <div className="flex space-x-4 p-2" style={{
              border: `1px solid ${currentTheme.borderColor}`,
              borderRadius: currentTheme.borderRadius,
              backgroundColor: currentTheme.backgroundColor
            }}>
              <div className="flex space-x-4 mx-auto">
                {[1, 2, 3].map((value) => (
                  <label key={value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value={value}
                      checked={solvedCount === value}
                      onChange={() => handleSolvedChange(value)}
                      className="form-radio"
                      style={{ accentColor: currentTheme.primaryColor }}
                    />
                    <span style={{ color: currentTheme.textColor }}>{value}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {problems.map((problem, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div>
                  <label className="block text-sm mb-1" style={{ color: currentTheme.textColor }}> "Problem {index + 1}:"</label>
                  <input
                    type="text"
                    placeholder="Contest ID"
                    value={problem.contestId}
                    onChange={(e) => handleProblemChange(index, "contestId", e.target.value)}
                    className="w-full p-2 focus:outline-none mb-2"
                    style={{ 
                      backgroundColor: currentTheme.backgroundColor,
                      color: currentTheme.textColor,
                      border: `1px solid ${currentTheme.borderColor}`,
                      borderRadius: currentTheme.borderRadius,
                      fontFamily: currentTheme.fontFamily
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Problem Index (e.g., A, B, C)"
                    value={problem.problemIndex}
                    onChange={(e) => handleProblemChange(index, "problemIndex", e.target.value)}
                    className="w-full p-2 focus:outline-none"
                    style={{ 
                      backgroundColor: currentTheme.backgroundColor,
                      color: currentTheme.textColor,
                      border: `1px solid ${currentTheme.borderColor}`,
                      borderRadius: currentTheme.borderRadius,
                      fontFamily: currentTheme.fontFamily
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          <button 
            onClick={handleSubmit} 
            className="w-full p-2 transition-all duration-300"
            style={{ 
              backgroundColor: currentTheme.highlightColor,
              color: currentTheme.primaryColor,
              border: `1px solid ${currentTheme.borderColor}`,
              borderRadius: currentTheme.borderRadius
            }}
          >
            $ submit
          </button>
          
          <AnimatePresence>
            {formUpdated && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-bold text-center"
                style={{ color: currentTheme.primaryColor }}
              >
                 "Theme CP problem added successfully!"
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Problem Card Component
const ProblemCard = ({ problem, onMarkSolved, loading }) => {
  const { currentTheme } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4"
      style={{ 
        backgroundColor: currentTheme.cardBgColor,
        borderRadius: currentTheme.borderRadius,
        border: `1px solid ${currentTheme.borderColor}`,
        boxShadow: currentTheme.boxShadow
      }}
    >
      <div style={{ fontFamily: currentTheme.fontFamily }}>
        <div className="mb-3 pb-2" style={{ borderBottom: `1px solid ${currentTheme.borderColor}` }}>
          <span style={{ color: currentTheme.accentColor }}>Contest Id:</span> 
          <span className="ml-2" style={{ color: currentTheme.textColor }}>{problem.contestId}</span>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-bold" style={{ color: currentTheme.primaryColor }}>
            {problem.index}: {problem.name}
          </h3>
        </div>
        
   
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <a
            href={`https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2 text-center transition-colors duration-300"
            style={{ 
              border: `1px solid ${currentTheme.borderColor}`,
              color: currentTheme.textColor,
              borderRadius: currentTheme.borderRadius
            }}
          >
            Open Problem
          </a>
          
          <button
            onClick={onMarkSolved}
            disabled={loading}
            className="flex-1 px-4 py-2 transition-colors duration-300"
            style={{ 
              border: `1px solid ${currentTheme.borderColor}`,
              color: currentTheme.textColor,
              borderRadius: currentTheme.borderRadius,
              backgroundColor: currentTheme.highlightColor,
              opacity: loading ? 0.5 : 1
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="loading-spinner mr-2" style={{
                  width: '1rem',
                  height: '1rem',
                  borderRadius: '50%',
                  border: `2px solid ${currentTheme.borderColor}`,
                  borderTopColor: currentTheme.primaryColor,
                  animation: 'spin 1s linear infinite'
                }}></div>
                $ verifying...
              </span>
            ) : (
              "Mark Solved"
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const FetchCodeforces = ({ handle }) => {
  const { currentTheme } = useTheme();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [themeCpProblems, setThemeCpProblems] = useState([]);
  const [themeIndex, setThemeIndex] = useState(0);
  const [normalProblems, setNormalProblems] = useState([]);
  const [normalIndex, setNormalIndex] = useState(0);
  const [isThemeCpDialogOpen, setIsThemeCpDialogOpen] = useState(false);
  const [isSolveConfirmationOpen, setIsSolveConfirmationOpen] = useState(false);
  const [markingSolved, setMarkingSolved] = useState(false);
  
  // Second handle for checking submissions
  const altHandle = "Kunal_Kashyap";
  
  const divProblemMap = {
    2: ["C", "C1", "D"],
    3: ["D", "E"],
    4: ["E", "F"],
  };
  
  function divChecker(div, name) {
    return name.includes(`Div. ${div}`);
  }

  const fetchContests = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/proxy/codeforces/getContests`);
      
      const contests = response.data.result.filter((contest) => contest.phase === "FINISHED");
   
      if (!contests || contests.length === 0) {
        console.log("No contests found.");
        setLoading(false);
        return;
      }
      
      fetchProblemsRecursive(contests, handle);
    } catch (error) {
      console.error("Error fetching contests:", error);
      toast.error(": Failed to fetch contests. Try again.");
      setLoading(false);
    }
  };
  
  const fetchProblemsRecursive = async (contests, handle, index = 0) => {
    if (index >= contests.length) {
      setLoading(false);
      return;
    }

    const contest = contests[index];
    const div = [2, 3, 4].find((d) => divChecker(d, contest.name));
  
    if (!div) {
      return fetchProblemsRecursive(contests, handle, index + 1);
    }
  
    try {
      const contestId = contest.id;
      const problemsRes = await axios.get(`${API_BASE_URL}/proxy/codeforces/getStandings?contestId=${contestId}`);
      const allProblems = problemsRes.data.result.problems;
      const problemIndices = divProblemMap[div];
      
      const filteredProblems = allProblems.filter((p) =>
        problemIndices.includes(p.index)
      );
  
      // Fetch both handles' submissions
      const mainSubmissionsRes = await axios.get(`${API_BASE_URL}/proxy/codeforces/getSubmissions?handle=${handle}`);
      const altSubmissionsRes = await axios.get(`${API_BASE_URL}/proxy/codeforces/getSubmissions?handle=${altHandle}`);
      
      const mainSubmissions = mainSubmissionsRes.data.result || [];
      const altSubmissions = altSubmissionsRes.data.result || [];
      
      // Combine both submissions
      const allSubmissions = [...mainSubmissions, ...altSubmissions];
      
      // Create a set of solved problems from both handles
      const solvedSet = new Set(
        allSubmissions
          .filter((s) => s.verdict === "OK")
          .map((s) => `${s.contestId}-${s.problem.index}`)
      );
  
      const firstUnsolved = filteredProblems.find((p) => !solvedSet.has(`${p.contestId}-${p.index}`));
  
      if (firstUnsolved) {
        setProblem(firstUnsolved);
        setLoading(false);
  
        await axios.post(`${API_BASE_URL}/api/storeProblem`, {
          handle: handle,
          problem: firstUnsolved,
        });
  
        return;
      }
  
      return fetchProblemsRecursive(contests, handle, index + 1);
    } catch (error) {
      console.error("Error fetching Codeforces data:", error);
      toast.error(": Failed to fetch problem data. Try again.");
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const fetchStoredProblem = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/getStoredProblem?handle=${handle}`);
        
        if (response.data.problem) {
          setProblem(response.data.problem); 
          setLoading(false);
        } else {
          fetchContests();
        }
      } catch (error) {
        console.error("Error fetching stored problem:", error);
        fetchContests();
      }
    };
  
    fetchStoredProblem();
  }, [handle]);
  
  const handleFormSubmit = async (data) => {
    if (data.problems.length === 0) {
      toast.error(": No problems provided.");
      return;
    }
  
    const { contestId, problemIndex } = data.problems[0];
    
    try {
      const response = await axios.get(`${API_BASE_URL}/proxy/codeforces/getStandings?contestId=${contestId}`);
      const allProblems = response.data.result.problems;
      
      const fullProblem = allProblems.find(p => p.index === problemIndex);

      if (!fullProblem) {
        toast.error(`: Problem ${problemIndex} not found in Contest ${contestId}`);
        return;
      }
  
      await axios.delete(`${API_BASE_URL}/api/deleteProblem`, {
        data: { handle: handle }
      });
  
      await axios.post(`${API_BASE_URL}/api/storeProblem`, {
        handle: handle,
        problem: fullProblem
      });
  
      setThemeCpProblems(data.problems);
      setThemeIndex(0);
      setProblem(fullProblem);
      
      toast.success("$ Theme CP problem set successfully!");
    } catch (error) {
      console.error("Error handling Theme CP problem:", error);
      toast.error(": Failed to set Theme CP problem. Try again.");
    }
  };
  
  const initiateMarkAsSolved = () => {
    if (!problem) {
      toast.error(": No problem to check.");
      return;
    }
    setIsSolveConfirmationOpen(true);
  };
  
  const markProblemAsSolved = async (xpDeductionPercent = 0, learningNotes = "") => {
    if (!problem) {
      toast.error(": No problem to check.");
      return;
    }
    
    setMarkingSolved(true);
    setIsSolveConfirmationOpen(false);
    
    try {
      // Fetch both handles' submissions
      const mainSubmissionsRes = await axios.get(`${API_BASE_URL}/proxy/codeforces/getSubmissions?handle=${handle}`);
      const altSubmissionsRes = await axios.get(`${API_BASE_URL}/proxy/codeforces/getSubmissions?handle=${altHandle}`);
      
      const mainSubmissions = mainSubmissionsRes.data.result || [];
      const altSubmissions = altSubmissionsRes.data.result || [];
      
      // Combine both submissions
      const allSubmissions = [...mainSubmissions, ...altSubmissions];
      
      // Create a set of solved problems from both handles
      const solvedSet = new Set(
        allSubmissions
          .filter((s) => s.verdict === "OK")
          .map((s) => `${s.contestId}-${s.problem.index}`)
      );
         
      const problemKey = `${problem.contestId}-${problem.index}`;
      
      // Check if either handle has solved the problem
      if (solvedSet.has(problemKey)) {
        await axios.delete(`${API_BASE_URL}/api/deleteProblem`, {
          data: { handle: handle, problemId: problem._id },
        });
        
        let experience = await experienceFinder(problem);
        
        if (xpDeductionPercent > 0) {
          const deduction = Math.ceil((experience * xpDeductionPercent) / 100);
          experience = Math.max(1, experience - deduction);
        }
        
        const totalProblemsSolved = 1;
        
        try {
          const updateData = {
            experience,
            totalProblemsSolved,
            problemId: `${problem.contestId}-${problem.index}`,
            problemName: problem.name,
            contestId: problem.contestId
          };
          
          if (learningNotes) {
            updateData.learningNotes = learningNotes;
          }
          
          await axios.put(`${API_BASE_URL}/api/users/${handle}/update`, updateData);
          
          if (xpDeductionPercent > 0) {
            toast.success(`$ Problem marked as solved with ${xpDeductionPercent}% XP deduction`);
            toast.success(`$ chmod +x problem.sh && ./problem.sh (+${experience} XP)`);
          } else {
            toast.success(`$ Problem marked as solved! Full XP awarded!`);
            toast.success(`$ chmod +x problem.sh && ./problem.sh (+${experience} XP)`);
          }
        } catch (error) {
          console.error("Error updating user:", error.response?.data || error.message);
          toast.error(": Failed to update XP. Try again.");
        }
        
        setProblem(null);
        fetchContests();
      } else {
        toast.error(": You haven't solved this problem yet. Try again.");
      }
    } catch (error) {
      console.error("Error checking problem status:", error);
      toast.error(": Error checking problem status. Try again.");
    } finally {
      setMarkingSolved(false);
    }
  };
  
  useEffect(() => {
    if (!problem && normalProblems.length > 0) {
      setProblem(normalProblems[0]);
      setNormalIndex(0);
    }
  }, [normalProblems]);
  
  return (
    <div className="flex flex-col space-y-4" style={{ fontFamily: currentTheme.fontFamily }}>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-2" style={{ borderBottom: `1px solid ${currentTheme.borderColor}` }}>
        <p className="text-sm" style={{ color: currentTheme.textColor }}>
    Next Problem to Solve Kunal
        </p>
        
        <button 
          onClick={() => setIsThemeCpDialogOpen(true)}
          className="px-3 py-1 text-sm"
          style={{ 
            border: `1px solid ${currentTheme.borderColor}`,
            color: currentTheme.textColor,
            backgroundColor: currentTheme.highlightColor,
            borderRadius: currentTheme.borderRadius
          }}
        >
        Add a Problem

        </button>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-6" style={{ color: currentTheme.textColor }}>
          <div className="loading-spinner mb-3" style={{
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            border: `2px solid ${currentTheme.borderColor}`,
            borderTopColor: currentTheme.primaryColor,
            animation: 'spin 1s linear infinite'
          }}></div>
          <p>$ Finding optimal problem... <span className="animate-pulse">_</span></p>
        </div>
      ) : problem ? (
        <ProblemCard problem={problem} onMarkSolved={initiateMarkAsSolved} loading={markingSolved} />
      ) : (
        <div className="p-4 text-center" style={{
          border: `1px solid ${currentTheme.borderColor}`,
          backgroundColor: currentTheme.cardBgColor,
          borderRadius: currentTheme.borderRadius,
          color: currentTheme.textColor
        }}>
          <p className="mb-3"> "No unsolved problems found."</p>
          <button 
            onClick={fetchContests}
            className="px-4 py-2"
            style={{ 
              border: `1px solid ${currentTheme.borderColor}`,
              color: currentTheme.textColor,
              backgroundColor: currentTheme.highlightColor,
              borderRadius: currentTheme.borderRadius
            }}
          >
            $ ./refresh.sh
          </button>
        </div>
      )}

      <AnimatePresence>
        {isThemeCpDialogOpen && (
          <ThemeCpDialog 
            isOpen={isThemeCpDialogOpen}
            onClose={() => setIsThemeCpDialogOpen(false)}
            handle={handle}
            onFormSubmit={handleFormSubmit}
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isSolveConfirmationOpen && (
          <SolveConfirmationDialog
            isOpen={isSolveConfirmationOpen}
            onClose={() => setIsSolveConfirmationOpen(false)}
            onConfirm={markProblemAsSolved}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FetchCodeforces;