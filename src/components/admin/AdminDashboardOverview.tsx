
import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Users, User, Clock, BarChart2,
  MessageSquare, Star, ArrowUp, ArrowDown,
  BookMarked, CheckCircle, XCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const AdminDashboardOverview: React.FC = () => {
  // Mock data - would come from API in full implementation
  const stats = {
    totalUsers: 1245,
    usersChange: 87,
    writers: 48,
    writersChange: 6,
    books: 215,
    booksChange: 12,
    pendingApprovals: 15,
    approvalsChange: 3,
    comments: 842,
    commentsChange: 124,
    ratings: 1827,
    ratingsChange: 246,
    totalSiteViews: 28647,
    popularGenres: [
      { name: 'Fiction', percentage: 42 },
      { name: 'Mystery', percentage: 28 },
      { name: 'Fantasy', percentage: 18 },
      { name: 'Romance', percentage: 12 }
    ],
    recentActivity: [
      { type: 'book', action: 'added', title: 'The Silent Patient', writer: 'Alex Michaelides', time: '2 hours ago' },
      { type: 'writer', action: 'approved', name: 'Sarah Johnson', time: '5 hours ago' },
      { type: 'book', action: 'pending', title: 'The Midnight Library', writer: 'Matt Haig', time: '1 day ago' },
      { type: 'comment', action: 'flagged', book: 'Circe', user: 'Anonymous User', time: '1 day ago' }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Admin Dashboard</h1>
        <p className="text-cinematic-text/70">Welcome back. Here's an overview of platform activity.</p>
      </div>

      {/* Stats Cards */}
      <div className="flex flex-wrap gap-4">
        <Card className="border-cinematic-gray/20 bg-cinematic-darker/30 w-[250px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Users</CardTitle>
            <CardDescription>Registered accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-500/10 rounded-full">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </div>
              <div className={`flex items-center ${stats.usersChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.usersChange > 0 ? (
                  <ArrowUp className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 mr-1" />
                )}
                <span>{Math.abs(stats.usersChange)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-cinematic-gray/20 bg-cinematic-darker/30 w-[250px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Writers</CardTitle>
            <CardDescription>Approved content creators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-accent/10 rounded-full">
                  <User className="h-5 w-5 text-accent" />
                </div>
                <div className="text-2xl font-bold">{stats.writers}</div>
              </div>
              <div className={`flex items-center ${stats.writersChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.writersChange > 0 ? (
                  <ArrowUp className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 mr-1" />
                )}
                <span>{Math.abs(stats.writersChange)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-cinematic-gray/20 bg-cinematic-darker/30 w-[250px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Books</CardTitle>
            <CardDescription>Published works</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-teal-500/10 rounded-full">
                  <BookOpen className="h-5 w-5 text-teal-500" />
                </div>
                <div className="text-2xl font-bold">{stats.books}</div>
              </div>
              <div className={`flex items-center ${stats.booksChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.booksChange > 0 ? (
                  <ArrowUp className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 mr-1" />
                )}
                <span>{Math.abs(stats.booksChange)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-cinematic-gray/20 bg-cinematic-darker/30 w-[250px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Pending</CardTitle>
            <CardDescription>Approval requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-amber-500/10 rounded-full">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
              </div>
              <div className={`flex items-center ${stats.approvalsChange > 0 ? 'text-amber-500' : 'text-green-500'}`}>
                {stats.approvalsChange > 0 ? (
                  <ArrowUp className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 mr-1" />
                )}
                <span>{Math.abs(stats.approvalsChange)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-cinematic-gray/20 bg-cinematic-darker/30 w-[250px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Comments</CardTitle>
            <CardDescription>Reader feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-500/10 rounded-full">
                  <MessageSquare className="h-5 w-5 text-purple-500" />
                </div>
                <div className="text-2xl font-bold">{stats.comments}</div>
              </div>
              <div className={`flex items-center ${stats.commentsChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.commentsChange > 0 ? (
                  <ArrowUp className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 mr-1" />
                )}
                <span>{Math.abs(stats.commentsChange)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-cinematic-gray/20 bg-cinematic-darker/30 w-[250px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Ratings</CardTitle>
            <CardDescription>Total submitted</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-yellow-500/10 rounded-full">
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="text-2xl font-bold">{stats.ratings}</div>
              </div>
              <div className={`flex items-center ${stats.ratingsChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.ratingsChange > 0 ? (
                  <ArrowUp className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 mr-1" />
                )}
                <span>{Math.abs(stats.ratingsChange)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="border-cinematic-gray/20 bg-cinematic-darker/30 lg:col-span-2">
          <CardHeader>
            <CardTitle>Platform Overview</CardTitle>
            <CardDescription>Insights and trends for the past 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 p-4 bg-cinematic-dark/50 rounded-lg">
                  <div className="flex items-center space-x-4 mb-4">
                    <BookOpen className="h-5 w-5 text-teal-500" />
                    <span className="font-medium">Content Insights</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-cinematic-text/70">Top Genre</div>
                      <div className="font-medium text-lg">Fiction</div>
                    </div>
                    <div>
                      <div className="text-sm text-cinematic-text/70">Most Active Writer</div>
                      <div className="font-medium text-lg">Matt Haig</div>
                    </div>
                    <div>
                      <div className="text-sm text-cinematic-text/70">Highest Rated Book</div>
                      <div className="font-medium text-lg">Circe</div>
                    </div>
                    <div>
                      <div className="text-sm text-cinematic-text/70">Most Reviewed</div>
                      <div className="font-medium text-lg">The Midnight Library</div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-4 bg-cinematic-dark/50 rounded-lg">
                  <div className="flex items-center space-x-4 mb-4">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">User Engagement</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-cinematic-text/70">Total Site Views</div>
                      <div className="font-medium text-lg">{stats.totalSiteViews}</div>
                    </div>
                    <div>
                      <div className="text-sm text-cinematic-text/70">Avg. Session Duration</div>
                      <div className="font-medium text-lg">4m 32s</div>
                    </div>
                    <div>
                      <div className="text-sm text-cinematic-text/70">Daily Active Users</div>
                      <div className="font-medium text-lg">428</div>
                    </div>
                    <div>
                      <div className="text-sm text-cinematic-text/70">New User Conversion</div>
                      <div className="font-medium text-lg">24.8%</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Popular Genres</h3>
                <div className="space-y-4">
                  {stats.popularGenres.map((genre, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>{genre.name}</span>
                        <span>{genre.percentage}%</span>
                      </div>
                      <Progress value={genre.percentage} className="h-2 bg-cinematic-gray/20" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-cinematic-gray/20 bg-cinematic-darker/30">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full mt-0.5 ${activity.type === 'book'
                    ? 'bg-teal-500/10'
                    : activity.type === 'writer'
                      ? 'bg-accent/10'
                      : 'bg-purple-500/10'
                    }`}>
                    {activity.type === 'book' && <BookMarked className={`h-5 w-5 ${activity.action === 'added'
                      ? 'text-green-500'
                      : activity.action === 'pending'
                        ? 'text-amber-500'
                        : 'text-red-500'
                      }`} />}
                    {activity.type === 'writer' && <User className="h-5 w-5 text-accent" />}
                    {activity.type === 'comment' && <MessageSquare className="h-5 w-5 text-purple-500" />}
                  </div>
                  <div>
                    <div className="font-medium">
                      {activity.type === 'book' && (
                        <>
                          {activity.action === 'added' ? 'New book added' : activity.action === 'pending' ? 'Book pending approval' : 'Book removed'}
                          : <span className="text-accent">{activity.title}</span>
                        </>
                      )}
                      {activity.type === 'writer' && (
                        <>
                          Writer {activity.action}: <span className="text-accent">{activity.name}</span>
                        </>
                      )}
                      {activity.type === 'comment' && (
                        <>
                          Comment {activity.action} on <span className="text-accent">{activity.book}</span>
                        </>
                      )}
                    </div>
                    <div className="text-sm text-cinematic-text/70 mt-1">
                      {activity.type === 'book' && `by ${activity.writer}`}
                      {activity.type === 'comment' && `by ${activity.user}`}
                      <span className="block">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-cinematic-gray/20 bg-cinematic-darker/30">
        <CardHeader>
          <CardTitle>Action Items</CardTitle>
          <CardDescription>Tasks requiring your attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-4 p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
              <Clock className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <div className="font-medium">Pending Approvals</div>
                <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
                <div className="text-sm text-cinematic-text/70 mt-1">Books awaiting review</div>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
              <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <div className="font-medium">Flagged Comments</div>
                <div className="text-2xl font-bold">7</div>
                <div className="text-sm text-cinematic-text/70 mt-1">Reported by users</div>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium">Writer Applications</div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-cinematic-text/70 mt-1">New user requests</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminDashboardOverview;
