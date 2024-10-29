import { Routes as RouterRoutes, Route } from 'react-router-dom';
import { LandingPage } from '@/components/pages/LandingPage';
import Dashboard from '@/components/pages/Dashboard/index';
import { StudySetup } from '@/components/pages/StudySetup';
import { IrbMaterials } from '@/components/pages/IrbMaterials';
import { TrainingMaterials } from '@/components/pages/TrainingMaterials';
import { Settings } from '@/components/pages/Settings';
import { StartupChecklist } from '@/components/pages/StartupChecklist';
import { RecruitmentMaterials } from '@/components/pages/RecruitmentMaterials';
import { ProtocolAnalysis } from '@/components/pages/ProtocolAnalysis';

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/study-setup" element={<StudySetup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/irb-materials" element={<IrbMaterials />} />
      <Route path="/training-materials" element={<TrainingMaterials />} />
      <Route path="/startup-checklist" element={<StartupChecklist />} />
      <Route path="/recruitment-materials" element={<RecruitmentMaterials />} />
      <Route path="/protocol-analysis" element={<ProtocolAnalysis />} />
      <Route path="/settings" element={<Settings />} />
    </RouterRoutes>
  );
}