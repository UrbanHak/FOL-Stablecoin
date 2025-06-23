import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/auth-context';

export function VerifyUnemploymentPage() {
  const [formData, setFormData] = React.useState({
    unemploymentStartDate: '',
    previousEmployer: '',
    previousJobTitle: '',
    documentType: ''
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      documentType: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/unemployment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification submission failed');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification submission failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl">✓</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Verification Submitted!</h2>
            <p className="text-muted-foreground">
              Your unemployment verification has been submitted for review. You'll be redirected to your dashboard shortly.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Verify Unemployment Status</CardTitle>
              <p className="text-muted-foreground">
                Provide information about your unemployment status to complete verification
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="unemploymentStartDate">Unemployment Start Date</Label>
                  <Input
                    id="unemploymentStartDate"
                    name="unemploymentStartDate"
                    type="date"
                    value={formData.unemploymentStartDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="previousEmployer">Previous Employer</Label>
                  <Input
                    id="previousEmployer"
                    name="previousEmployer"
                    value={formData.previousEmployer}
                    onChange={handleChange}
                    placeholder="Company name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="previousJobTitle">Previous Job Title</Label>
                  <Input
                    id="previousJobTitle"
                    name="previousJobTitle"
                    value={formData.previousJobTitle}
                    onChange={handleChange}
                    placeholder="Your job title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documentType">Verification Document Type</Label>
                  <Select onValueChange={handleSelectChange} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unemployment-benefits">Unemployment Benefits Letter</SelectItem>
                      <SelectItem value="termination-letter">Termination Letter</SelectItem>
                      <SelectItem value="layoff-notice">Layoff Notice</SelectItem>
                      <SelectItem value="severance-agreement">Severance Agreement</SelectItem>
                      <SelectItem value="cobra-notice">COBRA Notice</SelectItem>
                      <SelectItem value="other">Other Documentation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-muted/50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Document Upload (Coming Soon)</h3>
                  <p className="text-sm text-muted-foreground">
                    Document upload functionality will be available soon. For now, your verification 
                    will be submitted and our team will contact you for document verification.
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Submitting verification...' : 'Submit Verification'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}